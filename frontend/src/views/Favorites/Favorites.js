import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Layout, Form, Checkbox, Input, Button, Row, Col, List, Avatar, Skeleton, Divider } from 'antd';

import { getStops, getFavoriteStops, insertFavoriteStop, deleteFavoriteStop } from '../../api.js';
const { Search } = Input;

const { Header, Content, Footer } = Layout;
function Favorites() {
    var [username, setUsername] = useState(null);
    var [favoriteStops, setfavoriteStops] = useState([]);
    var [data, setData] = useState([]);
    var [searchKey, setSearchKey] = useState(null);

    useEffect(() => {
        var username = localStorage.getItem('username');
        if (username) {
            setUsername(username);
            getFavoriteStops(username).then(res => {
                setfavoriteStops(res);
            });
        }
    }, [])

    const onSearch = (values) => {
        setSearchKey(values);
        getStops(values).then(res => {
            setData(res.data);
        });
    };

    const onFavorite = (values) => {
        console.log(values);
        insertFavoriteStop(username, values).then(res => {
            getFavoriteStops(username).then(res => {
                setfavoriteStops(res);
            });
        });
    };

    const onRemove = (values) => {
        console.log(values);
        deleteFavoriteStop(username, values).then(res => {
            getFavoriteStops(username).then(res => {
                setfavoriteStops(res);
            });
        });
    };

    return (
        <Layout className="layout">
            <Header style={{ position: "sticky", top: "0", textAlign: 'center' }}>
                you are stupid for reading this
            </Header>
            <Content style={{ padding: '50px 150px', height: "calc(100vh - 65px)" }}>
                <Row style={{ marginBottom: 20 }}>
                    <Col style={{ textAlign: 'center' }} span={24}>
                        <h1>Favorites</h1>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {username ?
                            <Row gutter={30}>
                                <Col span={12}>
                                    <Search placeholder="Search Bus Stop" onSearch={onSearch} style={{ width: '100%' }} />
                                    <div
                                        id="scrollableDiv"
                                        style={{
                                            height: Math.min(data.length * 60, 700),
                                            overflow: 'auto',
                                            padding: '0 16px',
                                            border: '1px solid rgba(140, 140, 140, 0.35)',
                                        }}
                                    >
                                        <InfiniteScroll
                                            dataLength={data.length}
                                            hasMore={data.length < 50}
                                            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                            scrollableTarget="scrollableDiv"
                                        >
                                            <List
                                                dataSource={data}
                                                renderItem={item => (
                                                    <List.Item
                                                    >
                                                        <List.Item.Meta
                                                            title={<a >{item.StopID}</a>}
                                                        />
                                                        <Button onClick={() => onFavorite(item.StopID)}>Favorite</Button>
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
                                            height: Math.min(favoriteStops.length * 60, 731),
                                            overflow: 'auto',
                                            padding: '0 16px',
                                            border: '1px solid rgba(140, 140, 140, 0.35)',
                                        }}
                                    >
                                        <InfiniteScroll
                                            dataLength={favoriteStops.length}
                                            hasMore={favoriteStops.length < 50}
                                            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                            scrollableTarget="scrollableDiv"
                                        >
                                            <List
                                                dataSource={favoriteStops}
                                                renderItem={item => (
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            title={<a >{item.StopID}</a>}
                                                        />
                                                        <Button onClick={() => onRemove(item.StopID)}>Remove</Button>
                                                    </List.Item>
                                                )}
                                            />
                                        </InfiniteScroll>
                                    </div>
                                </Col>
                            </Row> : <p>You must be logged in to view your favorites.</p>}
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}

export default Favorites