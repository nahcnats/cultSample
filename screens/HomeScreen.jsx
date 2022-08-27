import React, { useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import AppHeaderButton from '../components/UI/AppHeaderButton';
import Card from '../components/UI/Card';
import Layout from '../components/Layout';
import CustomButton from '../components/UI/CustomButton';
import { db } from '../constants/firebaseConfig';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore'
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'

import * as authActions from '../store/actions/auth';
import Colors from '../constants/Colors';

function HomeScreen(props) {
    const [jobList, setJobList] = useState([]);
    const [lastDoc, setLastDoc] = useState();
    const [pageFilter, setPageFilter] = useState('createdDate');
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const pageLimit = 5;
    const qRef = collection(db, 'jobs');

    const services = pageFilter === 'createdDate' ? orderBy('createdDate', 'desc') : orderBy('likes', 'desc');

    async function fetchInitial() {
        const q = query(qRef, services, limit(pageLimit));
        const snapshot = await getDocs(q);
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];

        if (snapshot.docs.length === 0) {
            return;
        }

        let newJobs = [];

        snapshot.forEach(job => {
            newJobs.push(job.data());
        });

        setJobList(newJobs);
        setLastDoc(lastVisible);
    }

    async function fetchMore() {
        const q = query(qRef, services, startAfter(lastDoc), limit(pageLimit));
        const snapshot = await getDocs(q);
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];

        if (snapshot.docs.length === 0) {
            setIsLoadingMore(prev => !prev);
            return;
        }

        setIsLoadingMore(prev => !prev);

        let newJobs = [];

        snapshot.forEach(job => {
            newJobs.push(job.data());
        });

        setJobList(current => [...current, ...newJobs]);
        setLastDoc(lastVisible);
    }

    useEffect(() => {
        fetchInitial();
    }, []);


    function navigateToSeedHandler() {
        props.navigation.navigate('SeedScreen')
    }

    // function FilterSelector() {
    //     return (
    //         <View style={styles.filterContainer}>
    //             <Picker
    //                 selectedValue={pageFilter}
    //                 onValueChange={(itemValue, itemIndex) => setPageFilter(itemValue)}
    //             >
    //                 <Picker.Item label='Created Date' value='createdDate' />
    //                 <Picker.Item label='Likes' value='likes' />
    //             </Picker>
    //         </View>
    //     );
    // }

    function ItemComponent({ item }) {
        return (
            <Card style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.createDateContainer}>
                        <Text style={styles.createDateText}>{ moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    </View>
                    
                </View>
                <View style={styles.itemBody}>
                    <Text>{item.description}</Text>
                </View>
                <View style={styles.itemFooter}>
                    <View>
                        <TouchableOpacity>
                            <Text style={styles.itemFooterButtonText}>Detail</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemFooterRightContainer}>
                        <AntDesign name='like2' size={20} color='black' style={styles.itemFooterIcon} />
                        <Text>{item.likes}</Text>
                    </View>
                    
                </View>
            </Card>
        );
    }

    function EmptyComponent() {
        return (
            <Layout>
                <View style={styles.container}>
                    <Text>No data</Text>
                    <CustomButton title='Go to Seed' onPress={navigateToSeedHandler} />
                </View>
            </Layout>
        );
    }

    function LoadingComponent() {
        return (
            isLoadingMore ? <View style={styles.loadingContainer}><Text>Loading...</Text></View> : null
        );
    }

    return (
        <Layout>
            <SafeAreaView style={styles.safeAreaContainer}>
                {/* <FilterSelector /> */}
                <FlatList
                    data={jobList}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={ItemComponent}
                    initialNumToRender={pageLimit}
                    onEndReachedThreshold={0}
                    onEndReached={fetchMore}
                    contentContainerStyle={styles.itemContainer}
                    ListEmptyComponent={EmptyComponent}
                    ListFooterComponent={LoadingComponent}
                />
            </SafeAreaView>    
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeAreaContainer: {
        flex: 1,
    },
    filterContainer: {
        marginTop: 6,
        marginBottom: 6,
    },
    itemContainer: {
        minHeight: 280,
        margin: 10,
        padding: 20,
        display: 'flex',
    },
    itemHeader: {
        marginBottom: 12,
    },
    createDateContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    createDateText: {
        color: 'rgba(0, 0, 0, 0.5)',
    },
    itemBody: {
        flexGrow: 1
    },
    itemFooter: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    itemFooterRightContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemFooterIcon: {
        marginRight: 5,
    },
    itemFooterButtonText: {
        color: Colors.accent,
        fontFamily: 'poppins',
        fontSize: 16
    },
    itemTitle: {
        fontFamily: 'poppins-bold',
        fontSize: 16
    },
    itemName: {
        fontFamily: 'poppins',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export const homeScreenOptions = (navData) => {
    const dispatch = useDispatch();

    return {
        headerTitle: 'Home',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={AppHeaderButton}>
                <Item
                    title='Logout'
                    iconName={Platform.OS === 'android' ? 'md-log-out' : 'ios-log-out'}
                    onPress={() => dispatch(authActions.logout())}
                />
            </HeaderButtons>
        ),
    }
}

export default HomeScreen;