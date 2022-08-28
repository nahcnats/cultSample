import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text } from 'react-native';
import Layout from '../components/Layout';
import Card from '../components/UI/Card';
import Colors from '../constants/Colors';

function DetailScreen(props) {
    const { data } = props.route.params;
    const { name, aboutMe, companyName, companyInfo, title, description } = data.item;

    return (
        <SafeAreaView style={styles.container}>
            <Layout>
                <ScrollView>
                    <Card style={styles.contentContainer}>
                        <View style={[styles.sectionContainer, styles.nameContainer]}>
                            <Text style={styles.name}>{ name }</Text>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.title}>About Me</Text>
                            <View>
                                <Text>{ aboutMe }</Text>
                            </View>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.title}>Position: { title }</Text>
                            <View>
                                <Text>{ description }</Text>
                            </View>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.title}>Company: { companyName }</Text>
                            <View>
                                <Text>{ companyInfo }</Text>
                            </View>
                        </View>
                    </Card>
                </ScrollView>
            </Layout>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        margin: 10,
        padding: 20,
    },
    name: {
        fontSize: 20,
        fontFamily: 'poppins-bold',
    },
    title: {
        fontSize: 16,
        fontFamily: 'poppins-bold',
        marginBottom: 6,
    },
    nameContainer: {
        backgroundColor: Colors.accent,
    },
    sectionContainer: {
        marginBottom: 12,
        padding: 10,
        borderRadius: 10
    }
});

export const detailScreenOptions = (navData) => {
    return {
        headerTitle: 'Home',
    }
}

export default DetailScreen;