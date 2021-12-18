import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {environment as config} from "../../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

/**
 * @class AppComponent
 */
export class AppComponent {
  title = 'FabScan';
  public languages: any[] = [];
  public selectedLanguage: any;

  /**
   * @constructor
   * @param translateService
   */
  constructor(private translateService: TranslateService) {
    this.setLocalization();
  }

  /**
   *
   * @private
   */
  private setLocalization(): void{
    const savedLanguage = localStorage.getItem('language') || config.i18n.defaultLanguage;
    const languagesLabels: any = config.i18n.languageLabels;
    for (const lang of config.i18n.languages){
      this.languages.push({
        value: lang,
        img: 'assets/icons/flags/' + lang + '.svg',
        label: languagesLabels[lang]
      })
    }
    this.selectedLanguage = {
      'value': savedLanguage,
      'img': 'assets/icons/flags/' + savedLanguage + '.svg',
      'label': languagesLabels[savedLanguage]
    };

    this.translateService.addLangs(config.i18n.languages);
    this.translateService.setDefaultLang(savedLanguage);
  }

  /**
   *
   * @param language
   */
  public changeLanguage(language: string): void{
    this.selectedLanguage = {
      value: language,
      img: 'assets/icons/flags/' + language + '.svg',
      label: language
    };
    this.translateService.setDefaultLang(language);
    localStorage.setItem('language', language);
  }
}
