import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Carousel, Table, Space, Collapse, List, Image, Col } from 'antd';

const contentStyle = {
  margin: 0,
  color: '#fff',
  textAlign: 'left',
  background: ' #aec6cf',
};
const cardStyle = {
  margin: 0,
  color: '#fff',
  textAlign: 'left',
  background: '#FFD580',
};
const { Panel } = Collapse;

function App() {
  const [data, setData] = useState(null);
  const [city, setCity] = useState(null);
  const [zip, setZip] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://api.weatherapi.com/v1/forecast.json?key=081468c3730e4590a4113434230701&days=7&aqi=yes&q=' + zip);
      const data = await response.json();
      setData(data);
    }
    fetchData();
  }, [zip]);

  const onFinish = (values) => {
    console.log(values)
    setCity(values['city'])
    setZip(values['zip'])
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  console.log(data)
  const columns = [
    {
      title: 'High',
      dataIndex: 'maxtemp_f',
      key: 'temp_f',
      render: (_, record) => {
        return  (
          <Space>
            <div>{record.maxtemp_f + '°'}</div>
          </Space>
          )
      },
    },
    {
      title: 'Low',
      dataIndex: 'mintemp_f',
      key: 'temp_f',
      render: (_, record) => {
        return  (
          <Space>
            <div>{record.mintemp_f + '°'}</div>
          </Space>
          )
      },
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      render: (_, record) => {
        return  (
            <img src={record.condition.icon} />
          )
      },
    },
  ];

  const convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');
  
    let [hours, minutes] = time.split(':');
  
    if (hours === '12') {
      hours = '00';
    }
  
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
  
    return hours;
  }

  const contentStr = (item) => {
    const index = convertTime12to24(item['astro']['sunset'])
    const weather = item['hour'][index]
    var weight = 1.0
    if (!(weather['cloud'] >= 30 && weather['cloud'] <= 70)) {
      weight = weight - .5
    }
    weight = weight - ((weather['humidity'] / 100))*(.1)
    weight = weight - (Math.max(6 - weather['vis_miles'], 0)) * (.3)
    weight = Math.round(Math.max(0, weight) * 100)

    return "There is a " + weight + "% chance of catching a good sunset!"
  }

  const style = () => {
    if (data === null || city === null) {
      return {backgroundColor: " #aec6cf", height:"100vh", margin:"0px"}
    }
    return {backgroundColor: " #aec6cf", height:"100%", margin:"0px"}
  }

  return (
    <div style={style()}>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: 'flex',
          padding: '10px'
        }}
      >
      <Card title="Weather" headStyle={contentStyle} size="small">
      <Collapse defaultActiveKey={['1']}>
      <Panel header={city || "Choose a City :)"}key="1">
        <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item
            label="City"
            name="city"
            rules={[
                {
                  required: true,
                  message: 'Please input a city!',
                },
              ]}
            >
            <Input />
          </Form.Item>
          <Form.Item
            label="Zip Code"
            name="zip"
            rules={[
              {
                required: true,
                message: 'Please input a zip code!',
              },

            ]}
            >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button  htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
        </Panel>
      </Collapse>
      </Card>
      {data !== null && city &&
          <div style={{backgroundColor: " #aec6cf",height:"100%", margin:"0px"}}>
          <Card headStyle={contentStyle} title="Sunset Tracker" >
            <List
              itemLayout="vertical"
              bordered={true}
              size="small"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 1
              }}
              dataSource={data['forecast']['forecastday']}
              renderItem={(item) => (
                <List.Item
                  key={item.title}
                >
                  <List.Item.Meta
                    title={new Date(item['date']).toDateString()}
                    description={"Sunset: " + item['astro']['sunset']}
                  />
                  <Space>
                    {contentStr(item)}
                    <img
                      src={require('.//sunset-1.1s-200px.png')}
                    />
                  </Space>
                </List.Item>
              )}
            />
            </Card>
          <br/>
          <Card headStyle={contentStyle} title="7 Day Forecast" >
          <List
              itemLayout="vertical"
              bordered={true}
              size="small"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 1
              }}
              dataSource={data['forecast']['forecastday']}
              renderItem={(item) => (
                <List.Item
                  key={item.title}
                >
                <List.Item.Meta
                    title={new Date(item['date']).toDateString()}
                    description={"Sunset: " + item['astro']['sunset']}
                  />
                  <Card headStyle={cardStyle} bodyStyle={cardStyle} title={new Date(item['date']).toDateString()}>
                    <Table dataSource={[item['day']]} columns={columns} bordered pagination={false}/>
                  </Card>
                </List.Item>
              )}
              />
          </Card>
          </div>
      }
      </Space>
    </div>
  );
}

export default App;


// [Log] Object (bundle.js, line 51)

// current: {last_updated_epoch: 1673057700, last_updated: "2023-01-06 18:15", temp_c: 12.8, temp_f: 55, is_day: 0, …}

// forecast: {forecastday: Array}

// location: {name: "San Ramon", region: "California", country: "USA", lat: 37.77, lon: -121.94, …}

// Object Prototype
