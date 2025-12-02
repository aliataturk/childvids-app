import { NextRequest, NextResponse } from 'next/server';

interface TranslationRequest {
  text: string;
  targetLanguage: string;
}

interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
}

// Simple translation mapping for common languages
// In production, this would call an external translation API like Google Translate
const translations: Record<string, Record<string, string>> = {
  es: {
    'Music': 'Música',
    'Art': 'Arte',
    'Dance': 'Baile',
    'Educational': 'Educativo',
    'Stories': 'Cuentos',
    'Animals': 'Animales',
    'Science': 'Ciencia',
    'Cartoons': 'Dibujos Animados',
    '0-3 years': '0-3 años',
    '3-5 years': '3-5 años',
    '5-8 years': '5-8 años',
    '8-12 years': '8-12 años',
  },
  fr: {
    'Music': 'Musique',
    'Art': 'Art',
    'Dance': 'Danse',
    'Educational': 'Éducatif',
    'Stories': 'Histoires',
    'Animals': 'Animaux',
    'Science': 'Science',
    'Cartoons': 'Dessins Animés',
    '0-3 years': '0-3 ans',
    '3-5 years': '3-5 ans',
    '5-8 years': '5-8 ans',
    '8-12 years': '8-12 ans',
  },
  de: {
    'Music': 'Musik',
    'Art': 'Kunst',
    'Dance': 'Tanz',
    'Educational': 'Lehrreich',
    'Stories': 'Geschichten',
    'Animals': 'Tiere',
    'Science': 'Wissenschaft',
    'Cartoons': 'Cartoons',
    '0-3 years': '0-3 Jahre',
    '3-5 years': '3-5 Jahre',
    '5-8 years': '5-8 Jahre',
    '8-12 years': '8-12 Jahre',
  },
  tr: {
    'Music': 'Müzik',
    'Art': 'Sanat',
    'Dance': 'Dans',
    'Educational': 'Eğitici',
    'Stories': 'Hikayeler',
    'Animals': 'Hayvanlar',
    'Science': 'Bilim',
    'Cartoons': 'Çizgi Filmler',
    '0-3 years': '0-3 yaş',
    '3-5 years': '3-5 yaş',
    '5-8 years': '5-8 yaş',
    '8-12 years': '8-12 yaş',
  },
  pt: {
    'Music': 'Música',
    'Art': 'Arte',
    'Dance': 'Dança',
    'Educational': 'Educacional',
    'Stories': 'Histórias',
    'Animals': 'Animais',
    'Science': 'Ciência',
    'Cartoons': 'Desenhos Animados',
    '0-3 years': '0-3 anos',
    '3-5 years': '3-5 anos',
    '5-8 years': '5-8 anos',
    '8-12 years': '8-12 anos',
  },
  zh: {
    'Music': '音乐',
    'Art': '艺术',
    'Dance': '舞蹈',
    'Educational': '教育',
    'Stories': '故事',
    'Animals': '动物',
    'Science': '科学',
    'Cartoons': '卡通',
    '0-3 years': '0-3岁',
    '3-5 years': '3-5岁',
    '5-8 years': '5-8岁',
    '8-12 years': '8-12岁',
  },
  ja: {
    'Music': '音楽',
    'Art': 'アート',
    'Dance': 'ダンス',
    'Educational': '教育',
    'Stories': '物語',
    'Animals': '動物',
    'Science': '科学',
    'Cartoons': 'アニメ',
    '0-3 years': '0-3歳',
    '3-5 years': '3-5歳',
    '5-8 years': '5-8歳',
    '8-12 years': '8-12歳',
  },
  ar: {
    'Music': 'موسيقى',
    'Art': 'فن',
    'Dance': 'رقص',
    'Educational': 'تعليمي',
    'Stories': 'قصص',
    'Animals': 'حيوانات',
    'Science': 'علوم',
    'Cartoons': 'رسوم متحركة',
    '0-3 years': '0-3 سنوات',
    '3-5 years': '3-5 سنوات',
    '5-8 years': '5-8 سنوات',
    '8-12 years': '8-12 سنة',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body: TranslationRequest = await request.json();
    const { text, targetLanguage } = body;

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    // If target language is English or not supported, return original text
    if (targetLanguage === 'en' || !translations[targetLanguage]) {
      return NextResponse.json({
        translatedText: text,
        detectedLanguage: 'en',
      } as TranslationResponse);
    }

    const langTranslations = translations[targetLanguage];
    const translatedText = langTranslations[text] || text;

    return NextResponse.json({
      translatedText,
      detectedLanguage: 'en',
    } as TranslationResponse);
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const texts = searchParams.get('texts');
  const targetLanguage = searchParams.get('lang') || 'en';

  if (!texts) {
    return NextResponse.json(
      { error: 'Texts parameter is required' },
      { status: 400 }
    );
  }

  const textArray = texts.split(',');

  if (targetLanguage === 'en' || !translations[targetLanguage]) {
    return NextResponse.json({
      translations: textArray.reduce((acc, text) => {
        acc[text] = text;
        return acc;
      }, {} as Record<string, string>),
    });
  }

  const langTranslations = translations[targetLanguage];
  const result = textArray.reduce((acc, text) => {
    acc[text] = langTranslations[text] || text;
    return acc;
  }, {} as Record<string, string>);

  return NextResponse.json({ translations: result });
}
