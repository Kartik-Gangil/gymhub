import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const amenities = [
  {
    title: 'CARDIO DECK',
    icon: 'run',
  },
  {
    title: 'FREE WEIGHTS',
    icon: 'dumbbell',
  },
  {
    title: 'YOGA STUDIO',
    icon: 'meditation',
  },
  {
    title: 'INFRARED\nSAUNA',
    icon: 'heat-wave',
  },
];

interface GymDetail {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  plans: Plan[];
  state: string;
  logo: string;
  coverImage: string;
  description: string;
}

interface Plan {
  name: string;
  price: string;
  duration: string;
  id: string;
}

const STORAGE_KEY = '@gymhub_auth';

export default function GymDetailsScreen() {
  const { gymId } = useLocalSearchParams();

  const [gymData, setGymData] = useState<GymDetail>();
  const [planId, setPlanId] = useState('');
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (gymId) {
      fetchGymDetail();
      setPlanId('');
    }
  }, [gymId]);

  const getUserData = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedAuth) {
        const parsedData = JSON.parse(storedAuth);
        return parsedData;
      }

      return null;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGymDetail = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://192.168.29.218:8000/view/get-gym-detail/${gymId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const gym = await response.json();

      const formattedData = {
        ...gym.data.gymDetails,

        plans: gym.data.gymDetails.plans.map((plan: any) => ({
          name: plan.name,
          price: plan.price,
          duration: plan.days,
          id: plan._id,
        })),
      };

      setGymData(formattedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGym = async () => {
    try {
      if (!planId) {
        Alert.alert(
          'Select Plan',
          'Please select a membership plan'
        );
        return;
      }

      setJoining(true);

      const data = await getUserData();

      const res = await fetch(
        `http://192.168.29.218:8000/member/add-member/${gymId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: data.user.id,
            planId: planId,
          }),
        }
      );

      const responseData = await res.json();

      if (res.ok) {
        Alert.alert(
          'Success',
          'Membership activated successfully',
          [
            {
              text: 'OK',
              onPress: () =>
                router.push('/(app)/member/(tabs)/dashboard'),
            },
          ]
        );
      } else {
        Alert.alert(
          'Failed',
          responseData.message ||
          'Subscription not credited'
        );
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Subscription not credited'
      );
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff7a00" />

        <Text style={styles.loadingText}>
          Loading Gym Details...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() =>
              router.push({
                pathname: '/member',
              })
            }
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#ffb36b"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {gymData?.name}
          </Text>

          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={22}
              color="#ffb36b"
            />
          </TouchableOpacity>
        </View>

        {/* HERO IMAGE */}
        <ImageBackground
          source={{
            uri:
              gymData?.coverImage ||
              gymData?.logo ||
              'https://images.unsplash.com/photo-1554284126-1e8a1d9cbb0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3ltfGVufDB8fDB8fHww&w=1000&q=80',
          }}
          style={styles.heroImage}
          imageStyle={{ borderRadius: 12 }}
        />

        {/* STATS */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="star-outline"
              size={20}
              color="#ff7a00"
            />

            <Text style={styles.statValue}> - </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="#ff7a00"
            />

            <Text style={styles.statValue}>
              24/7 ACCESS
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={20}
              color="#ff7a00"
            />

            <Text style={styles.statValue}> - </Text>
          </View>
        </View>

        {/* PHILOSOPHY */}
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.orangeBar} />

            <Text style={styles.sectionTitle}>
              THE PHILOSOPHY
            </Text>
          </View>

          <Text style={styles.description}>
            {gymData?.description}
          </Text>
        </View>

        {/* AMENITIES */}
        <View style={styles.section}>
          <Text style={styles.bigTitle}>
            PREMIUM AMENITIES
          </Text>

          <View style={styles.amenitiesGrid}>
            {amenities.map((item, index) => (
              <View
                key={index}
                style={styles.amenityCard}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={28}
                  color="#ff7a00"
                />

                <Text style={styles.amenityText}>
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* MEMBERSHIP */}
        <View style={styles.section}>
          <Text style={styles.bigTitle}>
            SELECT YOUR LEVEL
          </Text>

          {gymData?.plans.map((item, index) => (
            <Card
              key={index}
              name={item.name}
              price={item.price}
              duration={item.duration}
              id={item.id}
              selected={planId === item.id}
              onSelect={() => setPlanId(item.id)}
            />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[
            styles.joinBtn,
            joining && { opacity: 0.7 },
          ]}
          onPress={handleJoinGym}
          disabled={joining}
        >
          {joining ? (
            <ActivityIndicator
              size="small"
              color="#000"
            />
          ) : (
            <Text style={styles.joinBtnText}>
              JOIN NOW
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

interface CardProps {
  name: string;
  price: string;
  duration: string;
  id: string;
  selected: boolean;
  onSelect: () => void;
}

export const Card = ({
  name,
  price,
  duration,
  selected,
  onSelect,
}: CardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onSelect}
      style={[
        styles.planCard,
        selected && styles.selectedPlanCard,
      ]}
    >
      <View>
        <Text style={styles.planName}>{name}</Text>

        <Text style={styles.month}>
          {duration} days
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{price}</Text>

          <Text style={styles.month}> / Month</Text>
        </View>

        <View
          style={[
            styles.radioOuter,
            selected && styles.radioOuterSelected,
          ]}
        >
          {selected && <View style={styles.radioInner} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
  },

  selectedPlanCard: {
    borderColor: '#ff7a00',
    borderWidth: 2,
    backgroundColor: '#1a1a1a',
  },

  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  radioOuterSelected: {
    borderColor: '#ff7a00',
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff7a00',
  },

  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
  },

  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },

  heroImage: {
    height: 320,
    marginHorizontal: 16,
    overflow: 'hidden',
  },

  statsContainer: {
    marginTop: 22,
    marginHorizontal: 16,
    backgroundColor: '#171717',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },

  statItem: {
    alignItems: 'center',
    gap: 8,
  },

  statValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  divider: {
    width: 1,
    height: 50,
    backgroundColor: '#333',
  },

  section: {
    marginTop: 34,
    paddingHorizontal: 16,
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  orangeBar: {
    width: 6,
    height: 28,
    backgroundColor: '#ff7a00',
    marginRight: 10,
  },

  sectionTitle: {
    color: '#d9d9d9',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },

  description: {
    color: '#d0d0d0',
    fontSize: 18,
    lineHeight: 32,
  },

  bigTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: 1,
  },

  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },

  amenityCard: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    gap: 18,
  },

  amenityText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  planCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 22,
  },

  planName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  price: {
    color: '#ff7a00',
    fontSize: 40,
    fontWeight: '900',
  },

  month: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '700',
  },

  joinBtn: {
    marginHorizontal: 16,
    marginTop: 40,
    marginBottom: 40,
    height: 60,
    backgroundColor: '#ff7a00',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  joinBtnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
});