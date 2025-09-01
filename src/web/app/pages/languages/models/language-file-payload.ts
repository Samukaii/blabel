import { TranslationFile } from '@shared/models/translation-file';

export interface LanguageFilePayload extends Pick<TranslationFile, 'key' |'path'>{

}
