import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";

const TermsAndConditions = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to Bear Rider Express</Text>
      <Text style={styles.paragraph}>
        By signing up and working as a rider for Bear Rider Express, you agree
        to comply with the following terms and conditions. Please read them
        carefully before accepting any assignments.
      </Text>

      <Text style={styles.subTitle}>1. Acceptance of Terms</Text>
      <Text style={styles.paragraph}>
        By registering as a rider with Bear Rider Express, you agree to be bound
        by these Terms and Conditions, as well as any additional rules or
        guidelines provided by the Company from time to time. If you do not
        agree with these terms, you are not authorized to provide services on
        behalf of Bear Rider Express.
      </Text>

      <Text style={styles.subTitle}>2. Eligibility</Text>
      <Text style={styles.paragraph}>
        To become a rider, you must:
        {"\n"}- Be at least 18 years old.
        {"\n"}- Hold a valid driver’s license for the vehicle type used for
        deliveries.
        {"\n"}- Have a registered vehicle that meets local safety standards.
        {"\n"}- Possess appropriate insurance coverage as required by local law.
        {"\n"}- Successfully complete any training or onboarding process
        required by the Company.
      </Text>

      <Text style={styles.subTitle}>3. Rider Obligations</Text>
      <Text style={styles.paragraph}>
        As a rider for Bear Rider Express, you agree to:
        {"\n"}- Provide prompt, efficient, and safe delivery of goods to
        customers.
        {"\n"}- Maintain a professional and courteous attitude at all times.
        {"\n"}- Keep all customer information confidential.
        {"\n"}- Use the platform and app only for lawful purposes.
        {"\n"}- Comply with all local traffic regulations and parking laws.
        {"\n"}- Maintain your delivery vehicle in good working condition.
        {"\n"}- Communicate any issues or delays in a timely manner.
      </Text>

      <Text style={styles.subTitle}>4. Compensation</Text>
      <Text style={styles.paragraph}>
        Riders will be compensated based on the delivery rates set by the
        Company:
        {"\n"}- Rates may vary depending on the type of delivery, distance, or
        other factors.
        {"\n"}- Payments will be made on a weekly basis.
        {"\n"}- Riders are responsible for any taxes associated with their
        earnings.
        {"\n"}- Bear Rider Express reserves the right to adjust rider fees at
        any time with prior notice.
      </Text>

      <Text style={styles.subTitle}>5. Insurance</Text>
      <Text style={styles.paragraph}>
        Riders are responsible for ensuring their vehicle is appropriately
        insured for commercial use. The Company does not provide vehicle or
        health insurance.
      </Text>

      {/* Continue formatting other sections similarly */}

      <Text style={styles.subTitle}>12. Contact Information</Text>
      <Text style={styles.paragraph}>
        For any questions or concerns, please contact Bear Rider Express at:
        {"\n"}Email: support@bearriderexpress.com
        {"\n"}Phone: [Insert Phone Number]
        {"\n"}Address: [Insert Company Address]
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
});

export default TermsAndConditions;
