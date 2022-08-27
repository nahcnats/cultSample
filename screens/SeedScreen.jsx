import React from 'react';
import { View, StyleSheet } from 'react-native';
import Layout from '../components/Layout';
import CustomButton from '../components/UI/CustomButton';
import { db } from '../constants/firebaseConfig';
import { jobsData as seedData } from '../seed/data';
import { addDoc, collection } from 'firebase/firestore'


function SeedScreen(props) {
    async function seedHandler() {
        seedData.map(async(item) => {
            const timestamp = Date.now();
            const payload = {
                title: item.title,
                    description: item.description,
                    name: item.name,
                    aboutMe: item.aboutMe,
                    likes: item.likes,
                    companyName: item.companyName,
                    companyInfo: item.companyInfo,
                    createdDate: timestamp
            }

            await addDoc(collection(db, 'jobs'), payload);

            props.navigation.navigate('AuthScreen');
        });
    }

    return (
        <Layout>
            <View style={styles.container}>
                <CustomButton title='Seed Data' onPress={seedHandler} />
            </View>
            
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export const seedScreenOptions = {
    headerTitle: 'Seed'
}

export default SeedScreen;