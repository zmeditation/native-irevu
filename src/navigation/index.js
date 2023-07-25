import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { strings } from '../translations/service';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';
import * as screens from '../screen'; 
import BottomTab from './bottomTab';
import { Icons } from '../components';
import { fonts } from '../theme';
import linking from '../../linking';

const Stack = createStackNavigator();

class Navigation extends React.Component {
  render() {
    return (
      <NavigationContainer ref={navigationRef} linking={linking}> 
        <Stack.Navigator
          initialRouteName={'splash'}
          screenOptions={{
            headerStyle: {
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20
            },
            headerTitleStyle: { fontFamily: fonts.semibold },
            headerTitleAlign: 'center'
          }}
        >
          <Stack.Screen
            name="splash"
            component={screens.Splash}
            options={{
              headerShown: false
            }}
          />
          {/* <Stack.Screen
            name="Welcome"
            component={screens.Welcome}
            options={{
              headerTitle: '',
              headerShown: false
            }}
          /> */}
          <Stack.Screen
            name="ViewAll"
            component={screens.ViewAll}
            options={{
              headerTitle: strings.view_all_performance,
              headerShown: true
            }}
          />
          <Stack.Screen name="Login" component={screens.Login} options={{ headerShown: false }} />
          <Stack.Screen
            name="ForgotPassword"
            component={screens.ForgotPassword}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Dashboard"
            component={BottomTab}
            options={{ headerShown: false, headerTitle: '' }}
          />

          <Stack.Screen
            name="Signup"
            component={screens.Signup}
            options={{
              headerTitle: '',
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Wallet"
            component={screens.Wallet}
            options={{
              headerTitle: strings.wallet,
              headerShown: true
            }}
          />
          <Stack.Screen
            name="Topup"
            component={screens.Topup}
            options={{
              headerTitle: strings.topup,
              headerShown: true
            }}
          />
          <Stack.Screen
            name="Subscriptions"
            component={screens.Subscriptions}
            options={{
              headerTitle: strings.subscriptions,
              headerShown: true
            }}
          />
          <Stack.Screen
            name="ContactUs"
            component={screens.ContactUs}
            options={{
              headerTitle: strings.contact_us,
              headerShown: true
            }}
          />
          <Stack.Screen
            name="EarnPoint"
            component={screens.EarnPoint}
            options={{
              headerTitle: strings.earn_points,
              headerShown: true
            }}
          />
          <Stack.Screen
            name="HelpGuide"
            component={screens.HelpGuide}
            options={{
              headerTitle: strings.help_guide,
              headerShown: true
            }}
          />
           <Stack.Screen
            name="Policy"
            component={screens.Policy}
            options={{
              headerTitle: 'Terms & Privacy Policy',
              headerShown: true
            }}
          />
          <Stack.Screen
            name="Results"
            component={screens.Results}
            options={{
              headerTitle: strings.results,
              headerShown: true
            }}
          />
          <Stack.Screen
            name="LessonPlan"
            component={screens.LessonPlan}
            options={{
              headerTitle: strings.lesson_plans,
              headerShown: true
            }}
          />
          <Stack.Screen
            name="MyLessonPlans"
            component={screens.MyLessonPlans}
            options={{
              headerTitle: strings.my_lesson_plans,
              headerShown: true
            }}
          />
          <Stack.Screen
            name="AddLessonPlan"
            component={screens.AddLessonPlan}
            options={{
              headerTitle: strings.add_lesson_plans,
              headerShown: true
            }}
          />
          <Stack.Screen
            name="CompleteAccount"
            component={screens.CompleteAccount}
            options={{
              headerTitle: '',
              headerRight: () => (
                <TouchableOpacity>
                  <Icons.AntDesign
                    name="logout"
                    color="black"
                    size={30}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              )
            }}
          />
          <Stack.Screen
            name="Profile"
            component={screens.Profile}
            options={{
              headerTitle: strings.account,
              headerShown: true,
              headerRight: () => (
                <TouchableOpacity onPress={() => this.props.logout(this)}>
                  <Icons.AntDesign
                    name="logout"
                    color="black"
                    size={30}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              )
            }}
          />
          <Stack.Screen
            name="ProfileEdit"
            component={screens.ProfileEdit}
            options={{
              headerTitle: strings.account,
              headerShown: true,
              headerRight: () => (
                <TouchableOpacity onPress={() => this.props.logout(this)}>
                  <Icons.AntDesign
                    name="logout"
                    color="black"
                    size={30}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              )
            }}
          />

          <Stack.Screen name="Home" component={BottomTab} options={{ headerShown: false }} />

          <Stack.Screen
            name="Resources"
            component={screens.Resources}
            options={{
              headerShown: true,
              headerTitle: strings.resources,
              headerHideBackButton: false,

              headerRight: () => (
                <TouchableOpacity>
                  <Icons.Entypo name="plus" color="black" size={30} style={{ marginRight: 10 }} />
                </TouchableOpacity>
              )
            }}
          />
          <Stack.Screen
            name="MyResources"
            component={screens.MyResources}
            options={{
              headerShown: true,
              headerTitle: strings.resources,

              headerRight: () => (
                <TouchableOpacity>
                  <Icons.Entypo name="plus" color="black" size={30} style={{ marginRight: 10 }} />
                </TouchableOpacity>
              )
            }}
          />
          <Stack.Screen
            name="AddResource"
            component={screens.AddResource}
            options={{
              headerShown: true,
              headerTitle: strings.add_resource
            }}
          />
          <Stack.Screen
            name="WriteQuestion"
            component={screens.WriteQuestion}
            options={{
              headerTitle: strings.write_your_question,
              headerHideBackButton: false,
              headerShown: true,

              headerRight: () => (
                <TouchableOpacity>
                  <Icons.Feather
                    name="trash"
                    color="black"
                    size={25}
                    style={{ marginRight: 10 }}
                    onPress={() => navigationRef.current.navigate('Home')}
                  />
                </TouchableOpacity>
              )
            }}
          />

          <Stack.Screen
            name="QuestionLength"
            component={screens.QuestionLength}
            options={{
              headerTitle: strings.write_your_question,
              headerHideBackButton: false,

              headerShown: true,
              headerRight: () => (
                <TouchableOpacity>
                  <Icons.Feather
                    name="trash"
                    color="black"
                    size={25}
                    style={{ marginRight: 10 }}
                    onPress={() => navigationRef.current.navigate('Home')}
                  />
                </TouchableOpacity>
              )
            }}
          />

          <Stack.Screen
            name="Questions"
            component={screens.Questions}
            options={{
              headerTitle: strings.write_your_question,
              headerHideBackButton: false,

              headerRight: () => (
                <TouchableOpacity>
                  <Icons.Feather
                    name="trash"
                    color="black"
                    size={25}
                    style={{ marginRight: 10 }}
                    onPress={() => navigationRef.current.navigate('Home')}
                  />
                </TouchableOpacity>
              )
            }}
          />
          <Stack.Screen
            name="editQuestion"
            component={screens.EditQuestion}
            options={{
              headerTitle: strings.edit_question,
              headerHideBackButton: false
            }}
          />

          <Stack.Screen
            name="Feedback"
            component={screens.Feedback}
            options={{
              headerShown: true,
              headerTitle: strings.feedback,
              headerHideBackButton: false
            }}
          />

          <Stack.Screen
            name="VideoPlayer"
            component={screens.VideoPlayer}
            options={{
              headerShown: true,
              headerTitle: '',
              headerHideBackButton: false
            }}
          />

          <Stack.Screen
            name="FeedbackChat"
            component={screens.FeedbackChat}
            options={{
              headerTitle: strings.feedback,
              headerHideBackButton: false
            }}
          />
          <Stack.Screen
            name="ResourcePurchase"
            component={screens.ResourcePurchase}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="LessonPurchase"
            component={screens.LessonPurchase}
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name="ClassDetailView"
            component={screens.ClassDetailView}
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name="TextEditor"
            component={screens.TextEditor}
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name="HomeworkSubmission"
            component={screens.HomeworkSubmission}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="HomeworkChat"
            component={screens.HomeworkChat}
            options={{
              headerShown: true,
              headerTitle: strings.homework_chat,
              headerHideBackButton: false
            }}
          />
          <Stack.Screen
            name="HomeworkGrading"
            component={screens.HomeworkGrading}
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name="HomeworkGraded"
            component={screens.HomeworkGraded}
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name="HomeworkInformation"
            component={screens.HomeworkInformation}
            options={(navigation) => ({
              headerStyle: { textAlign: 'center', alignSelf: 'center', color: 'black' },
              headerTitle: strings.homework,
              headerBackTitle: ' ',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigation.goBack()}>
                  <Icons.Entypo
                    name="chevron-left"
                    color="black"
                    size={30}
                    style={{ marginLeft: 0 }}
                  />
                </TouchableOpacity>
              )
            })}
          />

          <Stack.Screen
            name="PostQuestion"
            component={screens.PostQuestion}
            options={(navigation) => ({
              headerShown: false,
              headerTitle: strings.homework,
              headerBackTitle: ' ',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigation.goBack()}>
                  <Icons.Entypo
                    name="chevron-left"
                    color="black"
                    size={30}
                    style={{ marginLeft: 0 }}
                  />
                </TouchableOpacity>
              )
            })}
          />

          <Stack.Screen
            name="CreateHomework"
            component={screens.CreateHomework}
            options={(navigation) => ({
              headerTitle: strings.homework,
              headerBackTitle: ' ',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigation.goBack()}>
                  <Icons.Entypo
                    name="chevron-left"
                    color="black"
                    size={30}
                    style={{ marginLeft: 0 }}
                  />
                </TouchableOpacity>
              )
              // headerShown: false,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../redux/actions/auth';

const mapStateToProps = (state) => ({
  user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  logout: bindActionCreators(logout, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
