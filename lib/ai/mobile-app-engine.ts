import { Project, Page, Component, AppType } from '@/types/project';

/**
 * Mobile App Generation Engine for JcalAI
 * 
 * Generates production-ready mobile apps for iOS and Android
 * Supports React Native and Flutter frameworks
 */

export type MobileFramework = 'react-native' | 'flutter' | 'expo';
export type MobilePlatform = 'ios' | 'android' | 'both';

export interface MobileAppConfig {
  framework: MobileFramework;
  platforms: MobilePlatform;
  appName: string;
  bundleId: string; // e.g., com.innovixdynamix.myapp
  features: {
    pushNotifications: boolean;
    biometricAuth: boolean;
    cameraAccess: boolean;
    locationServices: boolean;
    offline: boolean;
    deepLinking: boolean;
    analytics: boolean;
    crashReporting: boolean;
  };
  styling: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    secondaryColor: string;
  };
}

export interface MobileAppGeneration {
  files: Record<string, string>;
  structure: string[];
  buildCommands: {
    ios: string[];
    android: string[];
  };
  deploymentConfig: {
    ios: any;
    android: any;
  };
}

export class MobileAppEngine {
  /**
   * Generates a complete mobile app from project structure
   */
  async generateMobileApp(
    project: Project,
    pages: Page[],
    components: Component[],
    config: MobileAppConfig
  ): Promise<MobileAppGeneration> {
    if (config.framework === 'react-native') {
      return this.generateReactNativeApp(project, pages, components, config);
    } else if (config.framework === 'flutter') {
      return this.generateFlutterApp(project, pages, components, config);
    } else {
      return this.generateExpoApp(project, pages, components, config);
    }
  }

  /**
   * Generates React Native app
   */
  private async generateReactNativeApp(
    project: Project,
    pages: Page[],
    components: Component[],
    config: MobileAppConfig
  ): Promise<MobileAppGeneration> {
    const files: Record<string, string> = {};

    // Generate package.json
    files['package.json'] = this.generateReactNativePackageJson(project, config);

    // Generate app.json
    files['app.json'] = this.generateReactNativeAppJson(project, config);

    // Generate App.tsx (main entry)
    files['App.tsx'] = this.generateReactNativeApp_tsx(project, pages);

    // Generate navigation
    files['src/navigation/AppNavigator.tsx'] = this.generateReactNativeNavigation(pages);

    // Generate screens from pages
    for (const page of pages) {
      const screenPath = `src/screens/${this.toPascalCase(page.name)}Screen.tsx`;
      files[screenPath] = this.generateReactNativeScreen(page, components);
    }

    // Generate components
    for (const component of components) {
      const componentPath = `src/components/${component.name}.tsx`;
      files[componentPath] = this.generateReactNativeComponent(component);
    }

    // Generate theme
    files['src/theme/index.ts'] = this.generateReactNativeTheme(config);

    // Generate API client
    files['src/services/api.ts'] = this.generateReactNativeApiClient(project);

    // Generate utils
    files['src/utils/index.ts'] = this.generateReactNativeUtils();

    // iOS configuration
    if (config.platforms === 'ios' || config.platforms === 'both') {
      files['ios/Podfile'] = this.generatePodfile(config);
      files['ios/Info.plist'] = this.generateInfoPlist(config);
    }

    // Android configuration
    if (config.platforms === 'android' || config.platforms === 'both') {
      files['android/app/build.gradle'] = this.generateBuildGradle(config);
      files['android/app/src/main/AndroidManifest.xml'] = this.generateAndroidManifest(config);
    }

    // Generate README
    files['README.md'] = this.generateMobileReadme(project, config);

    // Generate .gitignore
    files['.gitignore'] = this.generateMobileGitignore();

    const structure = Object.keys(files);

    const buildCommands = {
      ios: [
        'cd ios && pod install',
        'npx react-native run-ios',
        'npx react-native build-ios --mode=Release',
      ],
      android: [
        'npx react-native run-android',
        'cd android && ./gradlew assembleRelease',
        'cd android && ./gradlew bundleRelease',
      ],
    };

    const deploymentConfig = {
      ios: {
        scheme: config.appName,
        configuration: 'Release',
        exportMethod: 'app-store',
      },
      android: {
        buildType: 'release',
        flavor: 'production',
      },
    };

    return { files, structure, buildCommands, deploymentConfig };
  }

  /**
   * Generates Flutter app
   */
  private async generateFlutterApp(
    project: Project,
    pages: Page[],
    components: Component[],
    config: MobileAppConfig
  ): Promise<MobileAppGeneration> {
    const files: Record<string, string> = {};

    // Generate pubspec.yaml
    files['pubspec.yaml'] = this.generateFlutterPubspec(project, config);

    // Generate main.dart
    files['lib/main.dart'] = this.generateFlutterMain(project, config);

    // Generate routes
    files['lib/routes/app_routes.dart'] = this.generateFlutterRoutes(pages);

    // Generate screens
    for (const page of pages) {
      const screenPath = `lib/screens/${this.toSnakeCase(page.name)}_screen.dart`;
      files[screenPath] = this.generateFlutterScreen(page);
    }

    // Generate widgets (components)
    for (const component of components) {
      const widgetPath = `lib/widgets/${this.toSnakeCase(component.name)}.dart`;
      files[widgetPath] = this.generateFlutterWidget(component);
    }

    // Generate theme
    files['lib/theme/app_theme.dart'] = this.generateFlutterTheme(config);

    // Generate API service
    files['lib/services/api_service.dart'] = this.generateFlutterApiService(project);

    // Generate models
    files['lib/models/app_state.dart'] = this.generateFlutterModels();

    // iOS configuration
    if (config.platforms === 'ios' || config.platforms === 'both') {
      files['ios/Runner/Info.plist'] = this.generateFlutterInfoPlist(config);
    }

    // Android configuration
    if (config.platforms === 'android' || config.platforms === 'both') {
      files['android/app/build.gradle'] = this.generateFlutterBuildGradle(config);
      files['android/app/src/main/AndroidManifest.xml'] = this.generateFlutterAndroidManifest(config);
    }

    files['README.md'] = this.generateMobileReadme(project, config);

    const structure = Object.keys(files);

    const buildCommands = {
      ios: [
        'flutter pub get',
        'flutter build ios --release',
        'flutter build ipa',
      ],
      android: [
        'flutter pub get',
        'flutter build apk --release',
        'flutter build appbundle',
      ],
    };

    const deploymentConfig = {
      ios: {
        exportMethod: 'app-store',
      },
      android: {
        buildType: 'appbundle',
      },
    };

    return { files, structure, buildCommands, deploymentConfig };
  }

  /**
   * Generates Expo app (React Native with Expo)
   */
  private async generateExpoApp(
    project: Project,
    pages: Page[],
    components: Component[],
    config: MobileAppConfig
  ): Promise<MobileAppGeneration> {
    const files: Record<string, string> = {};

    // Similar to React Native but with Expo configuration
    files['package.json'] = this.generateExpoPackageJson(project, config);
    files['app.json'] = this.generateExpoAppJson(project, config);
    files['App.tsx'] = this.generateReactNativeApp_tsx(project, pages);

    // Use Expo Router for navigation
    files['app/_layout.tsx'] = this.generateExpoLayout(pages);

    for (const page of pages) {
      const screenPath = `app/${this.toKebabCase(page.slug)}.tsx`;
      files[screenPath] = this.generateReactNativeScreen(page, components);
    }

    files['README.md'] = this.generateMobileReadme(project, config);

    const structure = Object.keys(files);

    const buildCommands = {
      ios: [
        'npx expo prebuild',
        'eas build --platform ios',
      ],
      android: [
        'npx expo prebuild',
        'eas build --platform android',
      ],
    };

    const deploymentConfig = {
      ios: {
        bundleIdentifier: config.bundleId,
      },
      android: {
        package: config.bundleId,
      },
    };

    return { files, structure, buildCommands, deploymentConfig };
  }

  // React Native Generators
  private generateReactNativePackageJson(project: Project, config: MobileAppConfig): string {
    return JSON.stringify({
      name: project.name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      scripts: {
        android: 'react-native run-android',
        ios: 'react-native run-ios',
        start: 'react-native start',
        test: 'jest',
        lint: 'eslint .',
      },
      dependencies: {
        'react': '^18.2.0',
        'react-native': '^0.73.0',
        '@react-navigation/native': '^6.1.9',
        '@react-navigation/stack': '^6.3.20',
        'react-native-gesture-handler': '^2.14.0',
        'react-native-reanimated': '^3.6.0',
        'react-native-screens': '^3.29.0',
        'react-native-safe-area-context': '^4.8.0',
        ...(config.features.pushNotifications && {
          '@react-native-firebase/messaging': '^19.0.0',
        }),
        ...(config.features.biometricAuth && {
          'react-native-biometrics': '^3.0.1',
        }),
        ...(config.features.analytics && {
          '@react-native-firebase/analytics': '^19.0.0',
        }),
      },
      devDependencies: {
        '@babel/core': '^7.23.0',
        '@babel/preset-env': '^7.23.0',
        '@babel/runtime': '^7.23.0',
        '@react-native/babel-preset': '^0.73.0',
        '@react-native/metro-config': '^0.73.0',
        '@types/react': '^18.2.0',
        '@types/react-native': '^0.73.0',
        'typescript': '^5.3.0',
      },
    }, null, 2);
  }

  private generateReactNativeAppJson(project: Project, config: MobileAppConfig): string {
    return JSON.stringify({
      name: config.appName,
      displayName: project.name,
      expo: {
        name: project.name,
        slug: project.name.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        ios: {
          bundleIdentifier: config.bundleId,
          buildNumber: '1',
        },
        android: {
          package: config.bundleId,
          versionCode: 1,
        },
      },
    }, null, 2);
  }

  private generateReactNativeApp_tsx(project: Project, pages: Page[]): string {
    return `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
`;
  }

  private generateReactNativeNavigation(pages: Page[]): string {
    const imports = pages.map(p => 
      `import ${this.toPascalCase(p.name)}Screen from '../screens/${this.toPascalCase(p.name)}Screen';`
    ).join('\n');

    const screens = pages.map(p => 
      `      <Stack.Screen name="${this.toPascalCase(p.name)}" component=${this.toPascalCase(p.name)}Screen} />`
    ).join('\n');

    return `import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
${imports}

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
${screens}
    </Stack.Navigator>
  );
}
`;
  }

  private generateReactNativeScreen(page: Page, components: Component[]): string {
    return `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ${this.toPascalCase(page.name)}Screen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>${page.title || page.name}</Text>
      {/* Screen content */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
  },
});
`;
  }

  private generateReactNativeComponent(component: Component): string {
    return `import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ${component.name}Props {
  // Add props here
}

export const ${component.name}: React.FC<${component.name}Props> = (props) => {
  return (
    <View style={styles.container}>
      {/* Component content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Add styles
  },
});
`;
  }

  private generateReactNativeTheme(config: MobileAppConfig): string {
    return `export const theme = {
  colors: {
    primary: '${config.styling.primaryColor}',
    secondary: '${config.styling.secondaryColor}',
    background: '#ffffff',
    text: '#000000',
    error: '#ff0000',
    success: '#00ff00',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    body: { fontSize: 16, fontWeight: 'normal' },
  },
};
`;
  }

  private generateReactNativeApiClient(project: Project): string {
    return `const API_URL = '${project.config.database === 'supabase' ? 'https://your-project.supabase.co' : 'YOUR_API_URL'}';

export const api = {
  async get(endpoint: string) {
    const response = await fetch(\`\${API_URL}\${endpoint}\`);
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
    const response = await fetch(\`\${API_URL}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
`;
  }

  private generateReactNativeUtils(): string {
    return `export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
`;
  }

  // Flutter Generators
  private generateFlutterPubspec(project: Project, config: MobileAppConfig): string {
    return `name: ${project.name.toLowerCase().replace(/\s+/g, '_')}
description: ${project.description || 'A Flutter application'}
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2
  provider: ^6.1.0
  http: ^1.1.0
  ${config.features.analytics ? 'firebase_analytics: ^10.7.0' : ''}
  ${config.features.pushNotifications ? 'firebase_messaging: ^14.7.0' : ''}
  ${config.features.biometricAuth ? 'local_auth: ^2.1.0' : ''}

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`;
  }

  private generateFlutterMain(project: Project, config: MobileAppConfig): string {
    return `import 'package:flutter/material.dart';
import 'routes/app_routes.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${project.name}',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.${config.styling.theme},
      initialRoute: '/',
      routes: AppRoutes.routes,
    );
  }
}
`;
  }

  private generateFlutterRoutes(pages: Page[]): string {
    const imports = pages.map(p => 
      `import '../screens/${this.toSnakeCase(p.name)}_screen.dart';`
    ).join('\n');

    const routes = pages.map(p => 
      `    '${p.path}': (context) => ${this.toPascalCase(p.name)}Screen(),`
    ).join('\n');

    return `import 'package:flutter/material.dart';
${imports}

class AppRoutes {
  static Map<String, WidgetBuilder> routes = {
${routes}
  };
}
`;
  }

  private generateFlutterScreen(page: Page): string {
    return `import 'package:flutter/material.dart';

class ${this.toPascalCase(page.name)}Screen extends StatelessWidget {
  const ${this.toPascalCase(page.name)}Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${page.title || page.name}'),
      ),
      body: Center(
        child: Text('${page.name} Screen'),
      ),
    );
  }
}
`;
  }

  private generateFlutterWidget(component: Component): string {
    return `import 'package:flutter/material.dart';

class ${this.toPascalCase(component.name)} extends StatelessWidget {
  const ${this.toPascalCase(component.name)}({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      // Widget content
    );
  }
}
`;
  }

  private generateFlutterTheme(config: MobileAppConfig): string {
    return `import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData lightTheme = ThemeData(
    primaryColor: Color(int.parse('0xff${config.styling.primaryColor.replace('#', '')}')),
    colorScheme: ColorScheme.fromSeed(
      seedColor: Color(int.parse('0xff${config.styling.primaryColor.replace('#', '')}')),
    ),
    useMaterial3: true,
  );

  static ThemeData darkTheme = ThemeData(
    primaryColor: Color(int.parse('0xff${config.styling.primaryColor.replace('#', '')}')),
    colorScheme: ColorScheme.fromSeed(
      seedColor: Color(int.parse('0xff${config.styling.primaryColor.replace('#', '')}')),
      brightness: Brightness.dark,
    ),
    useMaterial3: true,
  );
}
`;
  }

  private generateFlutterApiService(project: Project): string {
    return `import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'YOUR_API_URL';

  Future<dynamic> get(String endpoint) async {
    final response = await http.get(Uri.parse('\$baseUrl\$endpoint'));
    return json.decode(response.body);
  }

  Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('\$baseUrl\$endpoint'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    return json.decode(response.body);
  }
}
`;
  }

  private generateFlutterModels(): string {
    return `class AppState {
  // Add your app state here
}
`;
  }

  // iOS Configuration
  private generatePodfile(config: MobileAppConfig): string {
    return `platform :ios, '13.0'
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

target '${config.appName}' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
  )

  ${config.features.pushNotifications ? "pod 'Firebase/Messaging'" : ''}
  ${config.features.analytics ? "pod 'Firebase/Analytics'" : ''}
  
  post_install do |installer|
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
      end
    end
  end
end
`;
  }

  private generateInfoPlist(config: MobileAppConfig): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDisplayName</key>
  <string>${config.appName}</string>
  <key>CFBundleIdentifier</key>
  <string>${config.bundleId}</string>
  ${config.features.cameraAccess ? `
  <key>NSCameraUsageDescription</key>
  <string>This app needs camera access</string>
  ` : ''}
  ${config.features.locationServices ? `
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>This app needs location access</string>
  ` : ''}
</dict>
</plist>
`;
  }

  private generateFlutterInfoPlist(config: MobileAppConfig): string {
    return this.generateInfoPlist(config);
  }

  // Android Configuration
  private generateBuildGradle(config: MobileAppConfig): string {
    return `android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "${config.bundleId}"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'com.facebook.react:react-native:+'
    ${config.features.pushNotifications ? "implementation 'com.google.firebase:firebase-messaging:23.0.0'" : ''}
    ${config.features.analytics ? "implementation 'com.google.firebase:firebase-analytics:21.0.0'" : ''}
}
`;
  }

  private generateFlutterBuildGradle(config: MobileAppConfig): string {
    return this.generateBuildGradle(config);
  }

  private generateAndroidManifest(config: MobileAppConfig): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${config.bundleId}">

    ${config.features.cameraAccess ? '<uses-permission android:name="android.permission.CAMERA" />' : ''}
    ${config.features.locationServices ? '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />' : ''}
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:name=".MainApplication"
        android:label="${config.appName}"
        android:icon="@mipmap/ic_launcher">
        
        <activity
            android:name=".MainActivity"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`;
  }

  private generateFlutterAndroidManifest(config: MobileAppConfig): string {
    return this.generateAndroidManifest(config);
  }

  // Expo Generators
  private generateExpoPackageJson(project: Project, config: MobileAppConfig): string {
    return JSON.stringify({
      name: project.name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      main: 'node_modules/expo/AppEntry.js',
      scripts: {
        start: 'expo start',
        android: 'expo start --android',
        ios: 'expo start --ios',
        web: 'expo start --web',
      },
      dependencies: {
        'expo': '~50.0.0',
        'expo-router': '~3.4.0',
        'react': '18.2.0',
        'react-native': '0.73.0',
      },
    }, null, 2);
  }

  private generateExpoAppJson(project: Project, config: MobileAppConfig): string {
    return JSON.stringify({
      expo: {
        name: project.name,
        slug: project.name.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: config.styling.theme,
        splash: {
          image: './assets/splash.png',
          resizeMode: 'contain',
          backgroundColor: config.styling.primaryColor,
        },
        ios: {
          bundleIdentifier: config.bundleId,
          supportsTablet: true,
        },
        android: {
          package: config.bundleId,
          adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: config.styling.primaryColor,
          },
        },
        plugins: [
          'expo-router',
          ...(config.features.pushNotifications ? ['expo-notifications'] : []),
          ...(config.features.cameraAccess ? ['expo-camera'] : []),
          ...(config.features.locationServices ? ['expo-location'] : []),
        ],
      },
    }, null, 2);
  }

  private generateExpoLayout(pages: Page[]): string {
    return `import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      ${pages.map(p => `<Stack.Screen name="${this.toKebabCase(p.slug)}" />`).join('\n      ')}
    </Stack>
  );
}
`;
  }

  // Utilities
  private generateMobileReadme(project: Project, config: MobileAppConfig): string {
    return `# ${project.name} - Mobile App

${project.description || 'A mobile application built with JcalAI'}

## Platform
- Framework: ${config.framework}
- Platforms: ${config.platforms}
- Bundle ID: ${config.bundleId}

## Getting Started

### Prerequisites
${config.framework === 'flutter' ? '- Flutter SDK\n- Dart' : '- Node.js\n- React Native CLI or Expo CLI'}
${config.platforms.includes('ios') ? '- Xcode (for iOS)' : ''}
${config.platforms.includes('android') ? '- Android Studio (for Android)' : ''}

### Installation
\`\`\`bash
${config.framework === 'flutter' ? 'flutter pub get' : 'npm install'}
\`\`\`

### Running the App
\`\`\`bash
# iOS
${config.framework === 'flutter' ? 'flutter run -d ios' : 'npm run ios'}

# Android
${config.framework === 'flutter' ? 'flutter run -d android' : 'npm run android'}
\`\`\`

### Building for Production
\`\`\`bash
# iOS
${config.framework === 'flutter' ? 'flutter build ios --release' : 'npm run build:ios'}

# Android
${config.framework === 'flutter' ? 'flutter build appbundle' : 'npm run build:android'}
\`\`\`

## Features
${Object.entries(config.features).filter(([_, v]) => v).map(([k]) => `- ${k}`).join('\n')}

## Built with JcalAI
This app was generated using [JcalAI](https://jcalai.com), an AI-powered no-code platform by Innovix Dynamix.
`;
  }

  private generateMobileGitignore(): string {
    return `# Dependencies
node_modules/
.pnp/
.pnp.js

# Build
build/
dist/
.expo/
.expo-shared/
ios/Pods/
ios/build/
android/app/build/
android/.gradle/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
`;
  }

  // Helper methods
  private toPascalCase(str: string): string {
    return str.split(/[-_\s]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  }

  private toSnakeCase(str: string): string {
    return str.toLowerCase().replace(/[-\s]/g, '_');
  }

  private toKebabCase(str: string): string {
    return str.toLowerCase().replace(/[_\s]/g, '-');
  }
}

export const mobileAppEngine = new MobileAppEngine();

