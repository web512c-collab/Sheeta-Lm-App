import JSZip from 'jszip';
import { ANDROID_SOURCE_FILES } from '../androidSourceFiles';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root project folder
  const projectFolder = zip.folder('sheeta-lm-app') || zip;

  for (const file of ANDROID_SOURCE_FILES) {
    projectFolder.file(file.path, file.code);
  }

  // Add standard Gradle wrapper properties & gradlew stubs
  projectFolder.file('gradle/wrapper/gradle-wrapper.properties', 
`distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`);

  projectFolder.file('.gitignore', 
`*.iml
.gradle
/local.properties
/.idea/caches
/.idea/libraries
/.idea/modules.xml
/.idea/workspace.xml
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
local.properties
`);

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
