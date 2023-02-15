import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, PermissionsAndroid, ScrollView, ActivityIndicator, Platform, StyleSheet, TouchableHighlight, Image, ImageBackground, Alert } from 'react-native';
import Voice, { SpeechErrorEvent, SpeechRecognizedEvent, SpeechResultsEvent } from '@react-native-voice/voice';
const HINDI_LOCALE = 'en-IN'
export default function App() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  async function requestMicrophonePermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone.',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission granted');
        } else {
          console.log('Microphone permission denied');
        }
      } catch (err) {
        console.error(err);
      }
    }
  }


  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  async function generateAnswer() {
    try {
      setLoading(true)
      const apiKey = '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';
      const response = await fetch(
        `https://api.openai.com/v1/engines/davinci/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt: text,
            max_tokens: 1024,
            temperature: 0.5,
          }),
        }
      );
      const json = await response.json();
      setResponse(json.choices[0].text);
      console.log("json", json)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const onSpeechStart = (e: any) => {
    console.log('onSpeechStart: ', e);
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log('onSpeechRecognized: ', e);
  };

  const onSpeechEnd = (e: any) => {
    console.log('onSpeechEnd: ', e);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', e);
  };

  const onSpeechResults = (e: any) => {
    console.log('onSpeechResults: ', e);
    setText(e?.value?.[0])
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechPartialResults: ', e);
  };

  const onSpeechVolumeChanged = (e: any) => {
    console.log('onSpeechVolumeChanged: ', e);
  };

  const _startRecognizing = async () => {

    try {
      await Voice.start('en-US');
      console.log('called start');
    } catch (e) {
      console.error(e);
    }

  };
  const _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  return (<ScrollView contentContainerStyle={{ paddingHorizontal: 40, marginTop: 60, paddingBottom: 80 }} >
    <View style={{
      flex: 1,
      justifyContent: 'center',
      width: '100%',
      alignItems: 'center',
      alignSelf: 'center'
    }} >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
        <TouchableOpacity style={{ borderRadius: 10, backgroundColor: '#a14211', padding: 20 }} onPress={_startRecognizing}>
          <Text>Start Recording</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 10, backgroundColor: '#a14211', padding: 20 }} onPress={_stopRecognizing}>
          <Text>Stop Recording</Text>
        </TouchableOpacity>
      </View>
      <TextInput style={{
        backgroundColor: '#ffffff',
        borderRadius: 8,
        color: '#bdbdbd',
        borderColor: '#dbdbdb',
        borderWidth: 0.4,
        marginVertical: 40,
        width: '80%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 3,
      }}
        value={text} onChangeText={setText} />
      <TouchableOpacity style={{ borderRadius: 10, backgroundColor: '#b21b32', paddingVertical: 10, paddingHorizontal: 30 }} onPress={generateAnswer}>
        <Text>Generate Answer</Text>
      </TouchableOpacity>
      {loading ? <View style={{
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        marginTop: 100,
        alignItems: 'center',
        alignSelf: 'center'
      }} >
        <ActivityIndicator size="small" />
      </View>
        : <Text>{response}</Text>}
    </View>
  </ScrollView>
  )
}


const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
});