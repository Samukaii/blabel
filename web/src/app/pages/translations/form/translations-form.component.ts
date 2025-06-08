import {
  Component,
  computed,
  DOCUMENT,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { map } from 'rxjs';
import { AiHintsService } from '../../../core/services/ai-hints/ai-hints.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Translation } from '../../../shared/models/translation';
import { TranslationChange } from '../../../shared/models/translation-change';
import { TranslationLanguage } from '../../../shared/models/translation-language';
import { CallPipe } from '../../../shared/pipes/call.pipe';
import { TranslationsFormLanguageComponent } from './language/translations-form-language.component';
import { InputComponent } from "../../../shared/components/shared/input/input.component";
import { TextareaComponent } from "../../../shared/components/shared/textarea/textarea.component";
import { ButtonComponent } from "../../../shared/components/shared/button/button.component";

@Component({
  selector: 'app-translations--form',
  templateUrl: './translations-form.component.html',
  styleUrl: './translations-form.component.scss',
  imports: [
    ReactiveFormsModule,
    TranslationsFormLanguageComponent,
    CallPipe,
    IconComponent,
    InputComponent,
    TextareaComponent,
    ButtonComponent
],
})
export class TranslationsFormComponent implements OnInit {
  title = input.required<string>();
  confirmButtonName = input.required<string>();
  languages = input.required<TranslationLanguage[]>();

  disablePath = input<boolean>();
  translation = input<Translation>();
  selectedLanguage = input<TranslationLanguage>();
  submit = output<TranslationChange>();

  mainLanguage = computed(() => this.languages()[0]);
  otherLanguages = computed(() => this.languages().slice(1));
  requestingAi = signal(false);

  mainLanguageEntry = computed(() => this.getEntry(this.mainLanguage()))

  private fb = inject(FormBuilder);
  private document = inject(DOCUMENT);
  private aiService = inject(AiHintsService);

  form = this.fb.nonNullable.group({
    path: ['', Validators.required],
    entries: this.fb.nonNullable.record<string>({}),
  });

  aiHintsForm = this.fb.nonNullable.group({
    onlyEmptyFields: [false],
    additionalContext: [""]
  });

  formValue = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.getRawValue())),
    { initialValue: this.form.getRawValue() }
  );

  mainLanguageIsEmpty = computed(() => {
    const formValue = this.formValue();

    return !formValue.entries[this.mainLanguage().key];
  });

  ngOnInit() {
    const path = this.form.controls.path;

    path.setValue(this.translation()?.path ?? '');

    if(this.disablePath()) path.disable();
  }

  ngAfterViewInit() {
    const selectedLanguage = this.selectedLanguage();

    if (!selectedLanguage) return;

    setTimeout(() => {
      const element = this.document.getElementById(selectedLanguage.key);
      element?.scrollIntoView({
        block: 'center',
        inline: 'center',
      });
      element?.focus();
    }, 100);
  }

  getEntry = (language: TranslationLanguage) => {
    return this.translation()?.entries.find(
      (entry) => entry.language.key === language.key
    );
  };

  getFormValue() {
    const formValue = this.form.getRawValue();

    return {
      path: formValue.path,
      entries: Object.entries(formValue.entries).map(([key, value]) => ({
        language: key,
        value: value,
      })),
    };
  }

  save() {
    const formValue = this.form.getRawValue();

    const value = {
      path: formValue.path,
      entries: Object.entries(formValue.entries).map(([key, value]) => ({
        language: key,
        value: value,
      })),
    };

    this.submit.emit(value);
  }

  fillWithAi() {
    this.requestingAi.set(true);

    console.log(this.aiHintsForm.getRawValue());

    // const value = {
    //   ...this.aiHintsForm.getRawValue(),
    //   entries: this.getFormValue().entries
    // }

    // this.aiService
    //   .fillWithAi(value)
    //   .subscribe((response: any) => {
    //     this.form.controls.entries.patchValue(response['languages']);
    //     this.requestingAi.set(false);
    //   });
  }
}
