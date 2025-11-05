import { View, Text, ScrollView, Alert, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "@/components/CustomInput";
import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async () => {
    const { email, password } = form;

    if (!email || !password)
      return Alert.alert(
        "Error",
        "Please enter valid email address & password."
      );

    setIsSubmitting(true);

    try {
      // await signIn({ email, password });

      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    
    <SafeAreaView className="h-full bg-white">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="p-5">
          <CustomInput
            placeholder="Enter your email"
            value={form.email}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, email: text }))
            }
            label="Enter Email"
            keyboardType="email-address"
          />
          <CustomInput
            placeholder="Enter your password"
            value={form.password}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, password: text }))
            }
            label="Password"
            secureTextEntry={true}
          />

          <CustomButton
            title="Sign In"
            isLoading={isSubmitting}
            onPress={submit}
          />

          <View className="flex justify-center mt-5 flex-row gap-2">
            <Text className="base-regular text-gray-100">
              Don&apos;t have an account?{" "}
            </Text>
            <Link href="/sign-up" className="base-bold text-primary">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
