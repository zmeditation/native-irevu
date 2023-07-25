import * as React from 'react';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { View, Text } from 'native-base';
import { StyleSheet } from 'react-native';
import { Icons } from '../';
import { fonts } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Language extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: [ '中⽂', 'English' ],
			selectedLanguage: 'English'
		};
	}

	languageOnChangeHandler = (languageName) => {
		this.setState({ selectedLanguage: languageName });
	};

	componentDidMount() {
		this.setState({ selectedLanguage: 'English' });
		AsyncStorage.getItem('LocalizedStrings').then((languageName) => {
			if (languageName != null) {
				this.setState({ selectedLanguage: languageName });
			}
		});
	}

	render() {
		return (
			<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
				<Icons.FontAwesome5 name="language" color="#467DFF" size={24} />
				<Text
					style={{
						fontSize: 17,
						fontFamily: fonts.regular,
						marginLeft: 10
					}}
				>
					{this.state.selectedLanguage}
				</Text>
				<View>
					<Menu>
						<MenuTrigger>
							<Icons.FontAwesome5
								name="caret-down"
								color="black"
								style={{ top: 3, marginLeft: 5 }}
								size={18}
							/>
						</MenuTrigger>
						<MenuOptions optionsContainerStyle={{ width: 100 }}>
							{this.state.language.map((items, key) => (
								<MenuOption
									key={key}
									onSelect={() => {
										this.languageOnChangeHandler(items);
										this.props.languageOnChangeHandler(items);
									}}
								>
									<Text style={{ color: '#467DFF' }}>{items}</Text>
								</MenuOption>
							))}
						</MenuOptions>
					</Menu>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	menuOptionContainer: {
		width: 100,
		backgroundColor: 'pink'
	}
});

export default Language;
