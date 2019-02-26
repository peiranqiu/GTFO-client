import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import {Icon} from "react-native-elements";

export default class Terms extends Component {

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <Icon name='chevron-left'
                          containerStyle={{position: 'absolute', left: 10, top: 20}}
                          size={30}
                          onPress={() => this.props.navigation.navigate("Me")}
                    />
                </View>
                <ScrollView style={{padding: 5}}>

                    <Text style={styles.h1}>Terms and Conditions</Text>
                    <Text style={styles.pp}>Last updated: January 17, 2019</Text>

                    <Text style={styles.p}>These Terms and Conditions ("Terms", "Terms and Conditions") govern your
                        relationship with GTFO mobile application (the "Service") operated by Wyse Technologies Inc
                        ("us", "we", or "our").</Text>
                    <Text style={styles.p}>Please read these Terms and Conditions carefully before using our GTFO mobile
                        application (the "Service").</Text>
                    <Text style={styles.p}>Your access to and use of the Service is based on your acceptance of and
                        compliance with these Terms. These Terms apply to all visitors, users and others who access or
                        use the Service.</Text>
                    <Text style={styles.p}>By accessing or using the Service you agree to be bound by these Terms and
                        accept all legal consequences. If you do not agree to these terms and conditions, in whole or in
                        part, please do not use the Service.</Text>

                    <Text style={styles.h2}>Content</Text>
                    <Text style={styles.p}>Our Service allows you to post, link, store, share and otherwise make
                        available certain information, text, graphics, videos, or other material ("Content"). You are
                        responsible for the Content that you post to the Service, including its legality, reliability,
                        and appropriateness.</Text>
                    <Text style={styles.p}>By posting Content to the Service, you grant us the right and license to use,
                        modify, perform, display, reproduce, and distribute such Content on and through the Service. You
                        retain any and all of your rights to any Content you submit, post or display on or through the
                        Service and you are responsible for protecting those rights.</Text>
                    <Text style={styles.p}>You represent and warrant that: (i) the Content is yours (you own it) or you
                        have the right to use it and grant us the rights and license as provided in these Terms, and
                        (ii) the posting of your Content on or through the Service does not violate the privacy rights,
                        publicity rights, copyrights, contract rights or any other rights of any person.</Text>
                    <Text style={styles.p}>We reserve all rights to block or remove communications or materials that we
                        determine to be: (a) abusive, defamatory, or obscene; (b) fraudulent, deceptive, or misleading;
                        (c) in violation of a copyright, trademark or, other intellectual property right of another or;
                        (d) offensive or otherwise unacceptable to us in our sole discretion.</Text>
                    <Text style={styles.p}>You acknowledge that, by providing you with the ability to view and
                        distribute user-generated content on the Service, we are merely acting as a passive conduit for
                        such distribution and is not undertaking any obligation or liability relating to any contents or
                        activities on the Service.</Text>

                    <Text style={styles.h2}>Accounts</Text>
                    <Text style={styles.p}>When you create an account with us, you must provide us information that is
                        accurate, complete, and current at all times. Failure to do so constitutes a breach of the
                        Terms, which may result in immediate termination of your account on our Service.</Text>
                    <Text style={styles.p}>You are responsible for safeguarding the password that you use to access the
                        Service and for any activities or actions under your password, whether your password is with our
                        Service or a third-party service.</Text>
                    <Text style={styles.p}>You agree not to disclose your password to any third party. You must notify
                        us immediately upon becoming aware of any breach of security or unauthorized use of your
                        account.</Text>
                    <Text style={styles.p}>You may not use as a username the name of another person or entity or that is
                        not lawfully available for use, a name or trade mark that is subject to any rights of another
                        person or entity other than you without appropriate authorization, or a name that is otherwise
                        offensive, vulgar or obscene.</Text>

                    <Text style={styles.h2}>Intellectual Property</Text>
                    <Text style={styles.p}>The Service and all contents, including but not limited to text, images,
                        graphics or code are the property of Wyse Technologies Inc and are protected by copyright,
                        trademarks, database and other intellectual property rights. You may display and copy, download
                        or print portions of the material from the different areas of the Service only for your own
                        non-commercial use. Any other use is strictly prohibited and may violate copyright, trademark
                        and other laws. These Terms do not grant you a license to use any trademark of Wyse Technologies
                        Inc or its affiliates. You further agree not to use, change or delete any proprietary notices
                        from materials downloaded from the Service.</Text>

                    <Text style={styles.h2}>Links To Other Web Sites</Text>
                    <Text style={styles.p}>The Service may contain links to third-party web sites or services that are
                        not owned or controlled by Wyse Technologies Inc.</Text>
                    <Text style={styles.p}>Wyse Technologies Inc has no control over, and assumes no responsibility for,
                        the content, privacy policies, or practices of any third party web sites or services. You
                        further acknowledge and agree that Wyse Technologies Inc shall not be responsible or liable,
                        directly or indirectly, for any damage or loss caused or alleged to be caused by or in
                        connection with use of or reliance on any such content, goods or services available on or
                        through any such websites or services.</Text>
                    <Text style={styles.p}>We strongly advise you to read the terms and conditions and privacy policies
                        of any third-party web sites or services that you visit.</Text>

                    <Text style={styles.h2}>Termination</Text>
                    <Text style={styles.p}>We may terminate or suspend access to our Service immediately, without prior
                        notice or liability, for any reason whatsoever, including, without limitation, if you breach the
                        Terms.</Text>
                    <Text style={styles.p}>All provisions of the Terms shall survive termination, including, without
                        limitation, ownership provisions, warranty disclaimers, indemnity and limitations of
                        liability.</Text>
                    <Text style={styles.p}>Upon termination, your right to use the Service will immediately cease. If
                        you wish to terminate your account, you may simply discontinue using the Service.</Text>

                    <Text style={styles.h2}>Indemnification</Text>
                    <Text style={styles.p}>You agree to indemnify, defend and hold harmless Wyse Technologies Inc, its
                        principals, officers, directors, representatives, employees, contractors, licensors, licensees,
                        suppliers and agents, from and against any claims, losses, damages, obligations, costs, actions
                        or demands.</Text>
                    <Text style={styles.p}>These include but are not limited to: (a) legal and accounting fees resulting
                        from your use of the Service; (b) your breach of any of these Terms; (c) anything you post on or
                        upload to the Service; and (d) any activity related to your account. This includes any negligent
                        or illegal conduct by you, any person or entity accessing the Service using your account whether
                        such access is obtained via fraudulent or illegal means.</Text>

                    <Text style={styles.h2}>Limitation Of Liability</Text>
                    <Text style={styles.p}>Wyse Technologies Inc, its directors, employees, partners, agents, suppliers,
                        or affiliates, shall not be liable for any loss or damage, direct or indirect, incidental,
                        special, consequential or punitive damages, including without limitation, economic loss, loss or
                        damage to electronic media or data, goodwill, or other intangible losses, resulting from (i)
                        your access to or use of the Service; (ii) your inability to access or use the Service; (iii)
                        any conduct or content of any third-party on or related to the Service; (iv) any content
                        obtained from or through the Service; and (v) the unauthorized access to, use of or alteration
                        of your transmissions or content, whether based on warranty, contract, tort (including
                        negligence) or any other claim in law, whether or not we have been informed of the possibility
                        of such damage, and even if a remedy set forth herein is found to have failed of its essential
                        purpose.</Text>

                    <Text style={styles.h2}>Disclaimer And Non-Waiver of Rights</Text>
                    <Text style={styles.p}>Wyse Technologies Inc makes no guarantees, representations or warranties of
                        any kind as regards the website and associated technology. Any purportedly applicable
                        warranties, terms and conditions are excluded, to the fullest extent permitted by law. Your use
                        of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE"
                        basis. The Service is provided without warranties of any kind, whether express or implied,
                        including, but not limited to, implied warranties of merchantability, fitness for a particular
                        purpose, non-infringement or course of performance, except as provided for under the laws of any
                        province in Canada. In such cases, the provincial law shall apply to the extent
                        necessary.</Text>
                    <Text style={styles.p}>Wyse Technologies Inc its subsidiaries, affiliates, and its licensors do not
                        warrant that a) the Service will function uninterrupted, secure or available at any particular
                        time or location; b) any errors or defects will be corrected; c) the Service is free of viruses
                        or other harmful components; or d) the results of using the Service will meet your
                        requirements.</Text>
                    <Text style={styles.p}>If you breach any of these Terms and Wyse Technologies Inc chooses not to
                        immediately act, or chooses not to act at all, Wyse Technologies Inc will still be entitled to
                        all rights and remedies at any later date, or in any other situation, where you breach these
                        Terms. Wyse Technologies Inc does not waive any of its rights. Wyse Technologies Inc shall not
                        be responsible for any purported breach of these Terms caused by circumstances beyond its
                        control. A person who is not a party to these Terms shall have no rights of enforcement.</Text>
                    <Text style={styles.p}>You may not assign, sub-license or otherwise transfer any of your rights
                        under these Terms.</Text>

                    <Text style={styles.h2}>Exclusions</Text>
                    <Text style={styles.p}>As set out, above, some jurisdictions do not allow the exclusion of certain
                        warranties or the exclusion or limitation of liability for consequential or incidental damages,
                        so the limitations above may not apply to you. Provincial laws of Canada may apply to certain
                        products and service provided.</Text>

                    <Text style={styles.h2}>Governing Law</Text>
                    <Text style={styles.p}>These Terms shall be governed by, and interpreted and enforced in accordance
                        with, the laws in the Province of British Columbia and the laws of Canada, as applicable.</Text>
                    <Text style={styles.p}>If any provision of these Terms is held to be invalid or unenforceable by a
                        court of competent jurisdiction, then any remaining provisions of these Terms will remain in
                        effect. These Terms constitute the entire agreement between us regarding our Service, and
                        supersede and replace any prior agreements, oral or otherwise, regarding the Service.</Text>

                    <Text style={styles.h2}>Changes</Text>
                    <Text style={styles.p}>We reserve the right, at our sole discretion, to modify or replace these
                        Terms at any time. If a revision is material we will make reasonable efforts to provide at least
                        30 days' notice prior to any new terms taking effect. What constitutes a material change will be
                        determined at our sole discretion.</Text>
                    <Text style={styles.p}>By continuing to access or use our Service after those revisions become
                        effective, you agree to be bound by the revised terms. If you do not agree to the new terms, in
                        whole or in part, please stop using the website and the Service.</Text>

                    <Text style={styles.h2}>Contact Us</Text>
                    <Text style={styles.p}>If you have any questions about these Terms, please contact us at
                        gtfotesting@gmail.com.</Text>


                    <Text style={styles.h1}>Privacy Policy</Text>
                    <Text style={styles.pp}>Effective date: January 17, 2019</Text>

                    <Text style={styles.p}>Wyse Technologies Inc ("us", "we", or "our") operates the GTFO mobile
                        application (hereinafter referred to as the "Service").</Text>
                    <Text style={styles.p}>This page informs you of our policies regarding the collection, use and
                        disclosure of personal data when you use our Service and the choices you have associated with
                        that data.</Text>
                    <Text style={styles.p}>We use your data to provide and improve the Service. By using the Service,
                        you agree to the collection and use of information in accordance with this policy. Unless
                        otherwise defined in this Privacy Policy, the terms used in this Privacy Policy have the same
                        meanings as in our Terms and Conditions.</Text>

                    <Text style={styles.h2}>Definitions</Text>
                    <Text style={styles.h3}>Service</Text>
                    <Text style={styles.p}>Service is the GTFO mobile application operated by Wyse Technologies
                        Inc</Text>
                    <Text style={styles.h3}>Personal Data</Text>
                    <Text style={styles.p}>Personal Data means data about a living individual who can be identified from
                        those data (or from those and other information either in our possession or likely to come into
                        our possession).</Text>
                    <Text style={styles.h3}>Usage Data</Text>
                    <Text style={styles.p}>Usage Data is data collected automatically either generated by the use of the
                        Service or from the Service infrastructure itself (for example, the duration of a page
                        visit).</Text>
                    <Text style={styles.h3}>Cookies</Text>
                    <Text style={styles.p}>Cookies are small files stored on your device (computer or mobile
                        device).</Text>

                    <Text style={styles.h2}>Information Collection and Use</Text>
                    <Text style={styles.p}>We collect several different types of information for various purposes to
                        provide and improve our Service to you.</Text>
                    <Text style={styles.h3}>Types of Data Collected</Text>
                    <Text style={styles.h3}>Personal Data</Text>
                    <Text style={styles.p}>While using our Service, we may ask you to provide us with certain personally
                        identifiable information that can be used to contact or identify you ("Personal Data").
                        Personally identifiable information may include, but is not limited to:</Text>
                    <Text style={styles.l}>• Email address</Text>
                    <Text style={styles.l}>• First name and last name</Text>
                    <Text style={styles.l}>• Cookies and Usage Data</Text>

                    <Text style={styles.h3}>Usage Data</Text>
                    <Text style={styles.p}>When you access the Service with a mobile device, we may collect certain
                        information automatically, including, but not limited to, the type of mobile device you use,
                        your mobile device unique ID, the IP address of your mobile device, your mobile operating
                        system, the type of mobile Internet browser you use, unique device identifiers and other
                        diagnostic data ("Usage Data").</Text>

                    <Text style={styles.h3}>Location Data</Text>
                    <Text style={styles.p}>We may use and store information about your location if you give us
                        permission to do so ("Location Data"). We use this data to provide features of our Service, to
                        improve and customise our Service.</Text>
                    <Text style={styles.p}>You can enable or disable location services when you use our Service at any
                        time by way of your device settings.</Text>

                    <Text style={styles.h3}>Tracking Cookies Data</Text>
                    <Text style={styles.p}>We use cookies and similar tracking technologies to track the activity on our
                        Service and we hold certain information.</Text>
                    <Text style={styles.p}>Cookies are files with a small amount of data which may include an anonymous
                        unique identifier. Cookies are sent to your browser from a website and stored on your device.
                        Other tracking technologies are also used such as beacons, tags and scripts to collect and track
                        information and to improve and analyse our Service.</Text>
                    <Text style={styles.p}>You can instruct your browser to refuse all cookies or to indicate when a
                        cookie is being sent. However, if you do not accept cookies, you may not be able to use some
                        portions of our Service.</Text>
                    <Text style={styles.p}>Examples of Cookies we use:</Text>
                    <Text style={styles.l}>• Session Cookies. We use Session Cookies to operate our Service.</Text>
                    <Text style={styles.l}>• Preference Cookies. We use Preference Cookies to remember your preferences
                        and various settings.</Text>
                    <Text style={styles.l}>• Security Cookies. We use Security Cookies for security purposes.</Text>

                    <Text style={styles.h2}>Use of Data</Text>
                    <Text style={styles.p}>Wyse Technologies Inc uses the collected data for various purposes:</Text>
                    <Text style={styles.l}>• To provide and maintain our Service</Text>
                    <Text style={styles.l}>• To notify you about changes to our Service</Text>
                    <Text style={styles.l}>• To allow you to participate in interactive features of our Service when you
                        choose to do so</Text>
                    <Text style={styles.l}>• To provide customer support</Text>
                    <Text style={styles.l}>• To gather analysis or valuable information so that we can improve our
                        Service</Text>
                    <Text style={styles.l}>• To monitor the usage of our Service</Text>
                    <Text style={styles.l}>• To detect, prevent and address technical issues</Text>

                    <Text style={styles.h2}>Transfer of Data</Text>
                    <Text style={styles.p}>Your information, including Personal Data, may be transferred to - and
                        maintained on - computers located outside of your state, province, country or other governmental
                        jurisdiction where the data protection laws may differ from those of your jurisdiction.</Text>
                    <Text style={styles.p}>If you are located outside Canada and choose to provide information to us,
                        please note that we transfer the data, including Personal Data, to Canada and process it
                        there.</Text>
                    <Text style={styles.p}>Your consent to this Privacy Policy followed by your submission of such
                        information represents your agreement to that transfer.</Text>
                    <Text style={styles.p}>Wyse Technologies Inc will take all the steps reasonably necessary to ensure
                        that your data is treated securely and in accordance with this Privacy Policy and no transfer of
                        your Personal Data will take place to an organisation or a country unless there are adequate
                        controls in place including the security of your data and other personal information.</Text>

                    <Text style={styles.h2}>Disclosure of Data</Text>
                    <Text style={styles.h3}>Business Transaction</Text>
                    <Text style={styles.p}>If Wyse Technologies Inc is involved in a merger, acquisition or asset sale,
                        your Personal Data may be transferred. We will provide notice before your Personal Data is
                        transferred and becomes subject to a different Privacy Policy.</Text>

                    <Text style={styles.h3}>Disclosure for Law Enforcement</Text>
                    <Text style={styles.p}>Under certain circumstances, Wyse Technologies Inc may be required to
                        disclose your Personal Data if required to do so by law or in response to valid requests by
                        public authorities (e.g. a court or a government agency).</Text>

                    <Text style={styles.h3}>Legal Requirements</Text>
                    <Text style={styles.p}>Wyse Technologies Inc may disclose your Personal Data in the good faith
                        belief that such action is necessary to:</Text>
                    <Text style={styles.l}>• To comply with a legal obligation</Text>
                    <Text style={styles.l}>• To protect and defend the rights or property of Wyse Technologies
                        Inc</Text>
                    <Text style={styles.l}>• To prevent or investigate possible wrongdoing in connection with the
                        Service</Text>
                    <Text style={styles.l}>• To protect the personal safety of users of the Service or the public</Text>
                    <Text style={styles.l}>• To protect against legal liability</Text>

                    <Text style={styles.h2}>Security of Data</Text>
                    <Text style={styles.p}>The security of your data is important to us but remember that no method of
                        transmission over the Internet or method of electronic storage is 100% secure. While we strive
                        to use commercially acceptable means to protect your Personal Data, we cannot guarantee its
                        absolute security.</Text>

                    <Text style={styles.h2}>Service Providers</Text>
                    <Text style={styles.p}>We may employ third party companies and individuals to facilitate our Service
                        ("Service Providers"), provide the Service on our behalf, perform Service-related services or
                        assist us in analysing how our Service is used.</Text>
                    <Text style={styles.p}>These third parties have access to your Personal Data only to perform these
                        tasks on our behalf and are obligated not to disclose or use it for any other purpose.</Text>

                    <Text style={styles.h3}>Analytics</Text>
                    <Text style={styles.p}>We may use third-party Service Providers to monitor and analyse the use of
                        our Service.</Text>
                    <Text style={styles.l}>Google Analytics</Text>
                    <Text style={styles.l}>Google Analytics is a web analytics service offered by Google that tracks and
                        reports website traffic. Google uses the data collected to track and monitor the use of our
                        Service. This data is shared with other Google services. Google may use the collected data to
                        contextualise and personalise the ads of its own advertising network.
                        You may opt-out of certain Google Analytics features through your mobile device settings, such
                        as your device advertising settings or by following the instructions provided by Google in their
                        Privacy Policy: https://policies.google.com/privacy?hl=en
                        For more information on the privacy practices of Google, please visit the Google Privacy Terms
                        web page: https://policies.google.com/privacy?hl=en
                    </Text>
                    <Text style={styles.l}>Firebase</Text>
                    <Text style={styles.l}>Firebase is analytics service provided by Google Inc.
                        You may opt-out of certain Firebase features through your mobile device settings, such as your
                        device advertising settings or by following the instructions provided by Google in their Privacy
                        Policy: https://policies.google.com/privacy?hl=en
                        We also encourage you to review the Google's policy for safeguarding your data:
                        https://support.google.com/analytics/answer/6004245.
                        For more information on what type of information Firebase collects, please visit the Google
                        Privacy Terms web page: https://policies.google.com/privacy?hl=en
                    </Text>
                    <Text style={styles.l}>Mixpanel</Text>
                    <Text style={styles.l}>Mixpanel is provided by Mixpanel Inc.
                        You can prevent Mixpanel from using your information for analytics purposes by opting-out. To
                        opt-out of Mixpanel service, please visit this page: https://mixpanel.com/optout/
                        For more information on what type of information Mixpanel collects, please visit the Terms of
                        Use page of Mixpanel: https://mixpanel.com/terms/
                    </Text>

                    <Text style={styles.h2}>Links to Other Sites</Text>
                    <Text style={styles.p}>Our Service may contain links to other sites that are not operated by us. If
                        you click a third party link, you will be directed to that third party's site. We strongly
                        advise you to review the Privacy Policy of every site you visit.</Text>
                    <Text style={styles.p}>We have no control over and assume no responsibility for the content, privacy
                        policies or practices of any third party sites or services.</Text>

                    <Text style={styles.h2}>Children's Privacy</Text>
                    <Text style={styles.p}>Our Service does not address anyone under the age of 18 ("Children").</Text>
                    <Text style={styles.p}>We do not knowingly collect personally identifiable information from anyone
                        under the age of 18. If you are a parent or guardian and you are aware that your Child has
                        provided us with Personal Data, please contact us. If we become aware that we have collected
                        Personal Data from children without verification of parental consent, we take steps to remove
                        that information from our servers.</Text>

                    <Text style={styles.h2}>Changes to This Privacy Policy</Text>
                    <Text style={styles.p}>We may update our Privacy Policy from time to time. We will notify you of any
                        changes by posting the new Privacy Policy on this page.</Text>
                    <Text style={styles.p}>We will let you know via email and/or a prominent notice on our Service,
                        prior to the change becoming effective and update the "effective date" at the top of this
                        Privacy Policy.</Text>
                    <Text style={styles.p}>You are advised to review this Privacy Policy periodically for any changes.
                        Changes to this Privacy Policy are effective when they are posted on this page.</Text>

                    <Text style={styles.h2}>Contact Us</Text>
                    <Text style={styles.p}>If you have any questions about this Privacy Policy, please contact
                        us:</Text>
                    <Text style={styles.l}>• By email: dchen@gtfo.gg</Text>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 70,
        margin: 0,
    },
    h1: {
        fontSize: 22,
        fontWeight: '800',
        marginTop: 20
    },
    h2: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 10
    },
    h3: {
        fontSize: 14,
        fontWeight: '600',
    },
    pp: {
        fontSize: 14,
        color: 'grey'
    },
    p: {
        fontSize: 14,
        marginTop: 5,
    },
    l: {
        fontSize: 14,
        marginTop: 5,
        marginLeft: 5
    },
});