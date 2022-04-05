import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Layout, Form, Checkbox, Input, Button, Row, Col, List, Avatar, Space, Divider } from 'antd';

import { advanceQuery1, advanceQuery2 } from '../../api.js';
const { Search } = Input;

const { Header, Content, Footer } = Layout;
function AdvanceQuery() {
    var [data1, setData1] = useState([]);
    var [data2, setData2] = useState([]);

    useEffect(() => {
        advanceQuery1().then(res => {
            setData1(res.data);
        });
        advanceQuery2().then(res => {
            setData2(res.data);
        });
    }, [])

    return (
        <Layout className="layout">
            <Header style={{ position: "sticky", top: "0", textAlign: 'center' }}>
                you are stupid for reading this
            </Header>
            <Content style={{ padding: '50px 150px', height: "calc(100vh - 65px)" }}>
                <Row style={{ marginBottom: 20 }}>
                    <Col style={{ textAlign: 'center' }} span={12}>
                        <h1>Query 1</h1>
                        <h2>Username,LineID,StopID,BusID</h2>
                    </Col>
                    <Col style={{ textAlign: 'center' }} span={12}>
                        <h1>Query 2</h1>
                        <h2>Username,LineID,Number,Direction,NumberOfBuses</h2>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Row gutter={30}>
                            <Col span={12}>
                                <div
                                    id="scrollableDiv"
                                    style={{
                                        height: Math.min(data1.length * 60, 700),
                                        overflow: 'auto',
                                        padding: '0 16px',
                                        border: '1px solid rgba(140, 140, 140, 0.35)',
                                    }}
                                >
                                    <InfiniteScroll
                                        dataLength={data1.length}
                                        hasMore={data1.length < 50}
                                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                        scrollableTarget="scrollableDiv"
                                    >
                                        <List
                                            dataSource={data1}
                                            renderItem={item => (
                                                <List.Item
                                                >
                                                    <List.Item.Meta
                                                        title={<Row>
                                                            <Col span={6}>{item.Username}</Col>
                                                            <Col span={6}>{item.LineID}</Col>
                                                            <Col span={6}>{item.StopID}</Col>
                                                            <Col span={6}>{item.BusID}</Col>
                                                            </Row>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </InfiniteScroll>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div
                                    id="scrollableDiv"
                                    style={{
                                        height: Math.min(data2.length * 60, 700),
                                        overflow: 'auto',
                                        padding: '0 16px',
                                        border: '1px solid rgba(140, 140, 140, 0.35)',
                                    }}
                                >
                                    <InfiniteScroll
                                        dataLength={data2.length}
                                        hasMore={data2.length < 50}
                                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                        scrollableTarget="scrollableDiv"
                                    >
                                        <List
                                            dataSource={data2}
                                            renderItem={item => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        title={<Row>
                                                            <Col span={4}>{item.Username}</Col>
                                                            <Col span={4}>{item.LineID}</Col>
                                                            <Col span={4}>{item.Number}</Col>
                                                            <Col span={4}>{item.Direction}</Col>
                                                            <Col span={4}>{item.NumberOfBuses}</Col>
                                                            </Row>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </InfiniteScroll>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}

export default AdvanceQuery