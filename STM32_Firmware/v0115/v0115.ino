#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>
#include "DFRobot_EC.h"
#include <EEPROM.h>
#include <Adafruit_SCD30.h>
#include "DFRobot_OxygenSensor.h"
#include <Wire.h>

// Setup PIN num
//const int TEMP_PIN = D9;
//const int LED_PIN = D13;
const int RELAY_PIN = 7;
const int TEMP_PIN = 10;
const int LED_PIN = 12;
const int PH_PIN = A1;
const int EC_PIN = A2;

Adafruit_SCD30  scd30; //CO2 sensor

// Data wire is plugged into digital pin 4 on the Arduino
#define ONE_WIRE_BUS TEMP_PIN

// Setup a oneWire instance to communicate with any OneWire device
OneWire oneWire(ONE_WIRE_BUS);    

// Pass oneWire reference to DallasTemperature library
DallasTemperature sensors(&oneWire);


float voltage,ecValue,temperature = 25;
DFRobot_EC ec;

//float calibration_value = 21.34;
float calibration_value = 22.3972;
//float calibration_value = 26.1045;
unsigned long int avgval; 
int buffer_arr[20],temp;

#define Oxygen_IICAddress ADDRESS_3
#define COLLECT_NUMBER  10             // collect number, the collection range is 1-100.

DFRobot_OxygenSensor oxygen;

unsigned char low_data[8] = {0};
unsigned char high_data[12] = {0};

#define NO_TOUCH       0xFE
#define THRESHOLD      100
#define ATTINY1_HIGH_ADDR   0x78
#define ATTINY2_LOW_ADDR   0x77

//setup json;
StaticJsonDocument<200> json_doc;
char json_output[200];

bool start=false;

void setup(void)
{
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  ec.begin();
  scd30.begin();
  oxygen.begin(Oxygen_IICAddress);
  Wire.begin();
  json_doc["ph"] = 0.0;
}

void loop(void)
{ 
  String command = Serial.readString();
  if(command=="start"){
    //Serial.println("start");
    start = true;
  }

  if(start==true){
    start = false;
    // read ph value
    digitalWrite(RELAY_PIN, LOW);
    delay(60000);     // wait for 1 min
    for(int i=0;i<20;i++){
      buffer_arr[i]=analogRead(PH_PIN);
      //Serial.print(buffer_arr[i]); Serial.print(" ");
      delay(100);
    }

    for(int i=0;i<19;i++){
      for(int j=i+1;j<20;j++){
        if(buffer_arr[i]>buffer_arr[j]){
          temp=buffer_arr[i];
          buffer_arr[i]=buffer_arr[j];
          buffer_arr[j]=temp;
        }
      }
    }
    avgval=0;
    for(int i=5;i<15;i++){
      avgval+=buffer_arr[i];
    }
    float volt=(float)avgval*5.0/1024/10;
    //Serial.println(volt);
    float ph_act = -4.23*volt + calibration_value;
    //float ph_act = -7.521*volt + calibration_value;
    json_doc["ph"] = ph_act;

    // read temperature
    float degree = readTemperature();
    json_doc["watertemp"] = degree;

    digitalWrite(RELAY_PIN, HIGH);
    delay(1000);

    // read ec value
    voltage = analogRead(EC_PIN)/1024.0*5000;   // read the voltage
    //Serial.println(analogRead(EC_PIN));
    //Serial.println(voltage);
    temperature = degree;          // read your temperature sensor to execute temperature compensation
    ecValue =  ec.readEC(voltage,temperature);  // convert voltage to EC with temperature compensation
    json_doc["ec"] = ecValue;
    
    // get air co2, humidity, temperature
    if(scd30.read()){
      json_doc["airtemp"] = scd30.temperature;
      json_doc["humidity"] = scd30.relative_humidity;
      json_doc["co2"] = scd30.CO2;
    }
    
    // get O2 
    float oxygenData = oxygen.getOxygenData(COLLECT_NUMBER);
    json_doc["oxygen"] = oxygenData;

    // get water level
    float waterlevel = WaterLevel();
    json_doc["waterlevel"] = waterlevel;

    // send data
    //json_doc["boxid"] = BOX_ID;
    serializeJson(json_doc, json_output);
    Serial.println(json_output);
  }
}


float readTemperature()
{
  //add your code here to get the temperature from your temperature sensor
  // Send the command to get temperatures
  sensors.requestTemperatures(); 

  //print the temperature in Celsius
  float degreeC = sensors.getTempCByIndex(0)+1.0;
  return degreeC;
}

void getHigh12SectionValue(void)
{
  memset(high_data, 0, sizeof(high_data));
  Wire.requestFrom(ATTINY1_HIGH_ADDR, 12);
  while (12 != Wire.available());

  for (int i = 0; i < 12; i++) {
    high_data[i] = Wire.read();
  }
  delay(10);
}

void getLow8SectionValue(void)
{
  memset(low_data, 0, sizeof(low_data));
  Wire.requestFrom(ATTINY2_LOW_ADDR, 8);
  while (8 != Wire.available());

  for (int i = 0; i < 8 ; i++) {
    low_data[i] = Wire.read(); // receive a byte as character
  }
  delay(10);
}

float WaterLevel()
{
  int sensorvalue_min = 250;
  int sensorvalue_max = 255;
  int low_count = 0;
  int high_count = 0;
  //while (1)
  //{
  uint32_t touch_val = 0;
  uint8_t trig_section = 0;
  low_count = 0;
  high_count = 0;
  getLow8SectionValue();
  getHigh12SectionValue();

  //Serial.println("low 8 sections value = ");
  for (int i = 0; i < 8; i++)
  {
    //Serial.print(low_data[i]);
    //Serial.print(".");
    if (low_data[i] >= sensorvalue_min && low_data[i] <= sensorvalue_max)
    {
      low_count++;
    }
    if (low_count == 8)
    {
      //Serial.print("      ");
      //Serial.print("PASS");
    }
  }
  //Serial.println("  ");
  //Serial.println("  ");
  //Serial.println("high 12 sections value = ");
  for (int i = 0; i < 12; i++)
  {
    //Serial.print(high_data[i]);
    //Serial.print(".");

    if (high_data[i] >= sensorvalue_min && high_data[i] <= sensorvalue_max)
    {
      high_count++;
    }
    if (high_count == 12)
    {
      //Serial.print("      ");
      //Serial.print("PASS");
    }
  }

  //Serial.println("  ");
  //Serial.println("  ");

  for (int i = 0 ; i < 8; i++) {
    if (low_data[i] > THRESHOLD) {
      touch_val |= 1 << i;

    }
  }
  for (int i = 0 ; i < 12; i++) {
    if (high_data[i] > THRESHOLD) {
      touch_val |= (uint32_t)1 << (8 + i);
    }
  }

  while (touch_val & 0x01)
  {
    trig_section++;
    touch_val >>= 1;
  }
  //Serial.print("water level = ");
  //Serial.print(trig_section * 5);
  //Serial.println("% ");
  //Serial.println(" ");
  //Serial.println("*********************************************************");
  //delay(1000);
  return(trig_section * 5.0);
  //}
}
