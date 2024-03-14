
import {Text,View,TouchableOpacity,} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeScreen } from "@/components/template";
import type { ApplicationScreenProps } from "@/types/navigation";
import { StripeProvider } from '@stripe/stripe-react-native';
import { useStripe } from '@stripe/stripe-react-native';


const Discover = ({ navigation }: ApplicationScreenProps) => {
  console.log('in Stripe Screen')
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const { paymentIntent, ephemeralKey, customer} = {
      paymentIntent: 'pi_3OdUFsCwhZJHjP6K0gQVI3hA_secret_XB1TMYLLB6fIkjmShpTU1BR0x',        
      ephemeralKey: 'ek_test_YWNjdF8xT0FlYVJDd2haSkhqUDZLLFVSRFRpNWFKVkhBZXBEYmhiZVBEN2hYV01FNldscjA_000U6nlPh3',
      customer: 'cus_PSP3s0LG7kIo3u',
      publishableKey: 'pk_test_51OAeaRCwhZJHjP6KxgcYEnNjl9krmgFtfkZi9bi3T7rvY8q0CDXjzeSrn5WBdvPALchyeiTz749HGS7VlrqBxsNP00T8zbvMfa'
    };

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      }
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.log(`Error code: ${error.code}`, error.message);
    } else {
      console.log('Success', 'Your order is confirmed!');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <StripeProvider
      publishableKey="pk_test_51OAeaRCwhZJHjP6KxgcYEnNjl9krmgFtfkZi9bi3T7rvY8q0CDXjzeSrn5WBdvPALchyeiTz749HGS7VlrqBxsNP00T8zbvMfa"
    >
        <SafeScreen>
            <View
              style={{
                flex:1,
                justifyContent:'center',
                alignItems:'center'
              }}
            >
              <Text> Hello World Stripe integration </Text>
              <TouchableOpacity style={{padding:15,backgroundColor:'dodgerblue', marginTop:7, borderRadius:10}} onPress={openPaymentSheet} disabled={!loading}>
                <Text style={{color:'white', fontWeight:900}}>Checkout</Text>
              </TouchableOpacity>
            </View>
        </SafeScreen>    
      </StripeProvider>
  );
};

export default Discover;