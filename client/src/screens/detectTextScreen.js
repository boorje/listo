import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Storage, Predictions} from 'aws-amplify';
import env from 'react-native-config';
import RNFS from 'react-native-fs';
// components
import LoadingComponent from '../components/loadingComponent';
// styles
import * as colors from '../styles/colors';

export default function DetectTextScreen(props) {
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [detectedItems, setDetectedItems] = useState(null);

  useEffect(() => {
    const image = props.navigation.getParam('image', null);
    processImage(image);
    startTimer(2000);
    // processImageAWS(image);
  }, []);

  // naivgates to next screen if timer is completed and items are found
  useEffect(() => {
    if (loadingFinished && detectedItems !== null) {
      props.navigation.navigate('ItemSelection', {detectedItems});
    }
  }, [loadingFinished, detectedItems, props.navigation]);

  function startTimer(ms) {
    setTimeout(() => setLoadingFinished(true), ms);
  }

  // GOOGLE
  async function processImage(imageFile) {
    try {
      if (!imageFile) {
        throw 'error';
      }
      const detectedLines = await detectText(imageFile);
      if (detectedLines) {
        setDetectedItems(await analyzeDetectedItems(detectedLines));
      } else {
        setDetectedItems([]);
      }
    } catch (error) {
      console.log(error);
      // TODO: Add error message
    }
  }

  async function detectText(imageFile) {
    const base64 = await RNFS.readFile(imageFile, 'base64');
    const body = {
      requests: [
        {
          image: {content: base64},
          features: [
            {type: 'TEXT_DETECTION', maxResults: 20},
            {type: 'DOCUMENT_TEXT_DETECTION', maxResults: 20},
          ],
        },
      ],
    };
    const API_KEY = env.GOOGLE_API_KEY;
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );
    const {responses} = await response.json();
    if (responses && responses[0]) {
      return responses[0].fullTextAnnotation.text.split('\n');
    } else {
      return null;
    }
  }

  async function analyzeDetectedItems(textLines) {
    const units = [
      'st',
      'styck',
      'stycken',
      'cl',
      'centiliter',
      'ml',
      'milliliter',
      'dl',
      'deciliter',
      'l',
      'liter',
      'mg',
      'milligram',
      'g',
      'gram',
      'hg',
      'hektogram',
      'kg',
      'kilo',
      'kilogram',
      'krm',
      'kryddmått',
      'tsk',
      'tesked',
      'msk',
      'matsked',
      'kvist',
      'kvistar',
      'kruka',
      'krukor',
      'näve',
      'nävar',
      'förp',
      'förpackning',
      'förpackningar',
      'låda',
      'lådor',
      'flak',
      'påse',
      'påsar',
      'pkt',
      'paket',
      'klyfta',
      'tärning',
      'tärningar',
      'bit',
      'bitar',
      'port',
      'portion',
      'portioner',
    ];
    let detectedItems = [];
    textLines.map((line, index) => {
      if (line.length > 0) {
        let item = {name: '', quantity: null, unit: null, index};
        let longestWord = '';
        line.split(' ').map(word => {
          if (parseInt(word)) {
            const divsion = word.split('/');
            if (divsion.length > 1) {
              const nr = divsion[0] / divsion[1];
              item.quantity = nr;
            } else {
              item.quantity = parseFloat(word);
            }
          } else if (parseFloat(word.replace(/,/, '.'))) {
            const float = parseFloat(word.replace(/,/, '.'));
            item.quantity = float; // handle float
          } else if (units.includes(word)) {
            item.unit = word;
          } else {
            if (word.length > longestWord.length) {
              longestWord = word;
              item.name = word;
            }
          }
        });
        detectedItems.push(item);
      }
    });
    return detectedItems;
  }

  // AWS
  async function processImageAWS(imageFile) {
    try {
      const key = await uploadToS3(imageFile);
      const detection = await detectText(key);
      const detectedItems = await textAnalyzerAWS(detection);
      props.navigation.navigate('ItemSelection', {detectedItems});
    } catch (error) {
      console.log('ERROR PROCESS IMAGE: ', error);
      // TODO: Add error message
    }
  }
  async function uploadToS3(image) {
    const res = await fetch(image);
    const blob = await res.blob();
    const publicFolder = 'public/listsOCR/';
    const fileName = 'OCR-' + blob.data.name;
    const {key} = await Storage.put(fileName, blob, {
      // customPrefix: {public: publicFolder},
      contentType: blob.data.type,
    });
    return key;
  }
  async function detectTextAWS(S3key) {
    const {text} = await Predictions.identify({
      text: {
        source: {key: S3key},
        format: 'PLAIN',
      },
    });
    return text;
  }
  async function textAnalyzerAWS(detection) {
    return detection.lines.map(line => {
      let obj = {};
      // const words = line.split(' ');
      // words.map(word => {
      //   // Simple test case
      //   if (parseInt(word)) {
      //     obj.quantity = word;
      //   } else if (units.includes(word)) {
      //     obj.unit = word;
      //   } else {
      //     obj.name = word;
      //   }
      // });
      obj.name = line;
      return obj;
    });
  }

  return (
    <LinearGradient colors={colors.testShade} style={styles.container}>
      <LoadingComponent color={'white'} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  icons: {},
});
