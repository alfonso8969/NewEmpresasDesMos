import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import { spainIdType, validCIF, validDNI, validNIE } from "spain-id";

export class Utils {

  static passwordReg: RegExp = new RegExp(/(?!^[0-9]*$)(?!^[a-zA-Z!@#$%^&*()_+=<>?]*$)^([a-zA-Z!@#$%^&*()_+=<>?0-9]{6,15})$/);
  static emailReg: RegExp = new RegExp(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/);
  static phoneReg: RegExp = new RegExp(/[0-9]{9}/);
  static codPostalReg: RegExp = new RegExp(/289+\d{2}/);

  static regexTheme: RegExp = new RegExp(/^[a-zA-Z\sÑÁÉÍÓÚÜáéíóú,]+$/);
  static regex: RegExp = new RegExp(/^[A-Z\sÑÁÉÍÓÚÜ,]+$/);
  static regex2: RegExp = new RegExp(/^[A-Za-z0-9ÑÁÉÍÓÚÜñáéíóú-]+$/);
  static regex3: RegExp = new RegExp(/^[A-Za-z0-9\sÑÁÉÍÓÚÜñáéíóúº]+$/);

  static webReg: RegExp = new RegExp(/^((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]+[.])+[a-zA-Z]{2,4}(:\d+)?(\/[~_.\-a-zA-Z0-9=&%@:]+)*\??[~_.\-a-zA-Z0-9=&%@:]*$/);
  static linkedInReg: RegExp = new RegExp(/[(https:\/\/www\.linkedin.com)]{20}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)+/);
  static FacebookReg: RegExp = new RegExp(/((http|https):\/\/|)(www\.|)facebook\.com\/[a-zA-Z0-9.]{1,}/);
  static InstagramReg: RegExp = new RegExp(/(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]{1,30}\/?/);
  static TwitterReg: RegExp = new RegExp(/(https?:\/\/)?(www\.)?twitter\.com\/[A-Za-z0-9_@]{5,15}(\?(\w+=\w+&?)*)?/);
  static TikTokReg: RegExp = new RegExp(/((https?:\/\/)?(www\.)?tiktok\.com\/\@[a-zA-Z0-9_%]*)/);

  static DNI_REGEX: RegExp = new RegExp(/^(\d{8})([A-Z])$/);
  static CIF_REGEX: RegExp = new RegExp(/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/);
  static NIE_REGEX: RegExp = new RegExp(/^[XYZ]\d{7,8}[A-Z]$/);

  public static makeString(length: number): string {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*_+=<>?';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public static getMonths(month: number = 0): string | string[] {
    const months =  ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    if (month > 0) {
      return months[month];
    }
    return months;
  }

  public static getRegexDocument(control: AbstractControl): ValidationErrors | null {
    let valid: boolean;
    if (control.get('cif')?.value && control.get('cif')?.value.length === 9) {
      console.log(spainIdType(control.get('cif')?.value))
      let documentType = spainIdType(control.get('cif')?.value);
      if (documentType === 'cif') {
        valid = validCIF(control.get('cif')?.value);
      } else if (documentType === 'dni') {
        valid = validDNI(control.get('cif')?.value);
      } else {
        valid = validNIE(control.get('cif')?.value);
      }
      return valid ? null : { invalidPattern: true };
    }
    return null;
  }

  public static changeEye(element: HTMLElement, elementClose: HTMLElement):  void {
    const type = elementClose.getAttribute('type') === 'password' ? 'text' : 'password';
    elementClose.setAttribute('type', type);
    const clase = element.getAttribute('class')=== 'far fa-eye' ? 'far fa-eye-slash' : 'far fa-eye';
    element.setAttribute('class', clase)!;
  }

  public static changeEyeTime(element: HTMLElement, elementClose: HTMLElement ): void {
    setTimeout(() => {
      this.changeEye(element, elementClose);
    }, 2000);
  }

  /**
   * Función que comprueba los errores de un formulario.
   * @param {FormGroup<any>} form Formulario a inspeccionar
   *
   * @returns {string} Un string en formato JSON con los errores
   */
  public static getFormValidationErrors(form: FormGroup<any>): string {
    const result: { Campo: string; error: string; value: any }[] = [];
    Object.keys(form.controls).forEach(key => {
      const controlErrors: any = form!.get(key)!.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
            Campo: key,
            'error': keyError,
            value: form!.get(key)!.value
          });
        });
      }
    });
    return JSON.stringify(result);
  }

  public static setFormControlsReadOnly(form: FormGroup, enabled: boolean = true): void {
    Object.keys(form.controls).forEach(key => {
      const control: AbstractControl = form.get(key)!;
      if (control && enabled) {
        control.disable({
          emitEvent: enabled,
          onlySelf: enabled
        });
      } else {
        control.enable({
          emitEvent: enabled,
          onlySelf: enabled
        });
      }
    });
  }

  public static getTemplateEmail(name: string, lastname: string, password: string): string {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title></title>
    <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <style type="text/css">
    #outlook a {
      padding:0;
    }
    .es-button {
      mso-style-priority:100!important;
      text-decoration:none!important;
    }
    a[x-apple-data-detectors] {
      color:inherit!important;
      text-decoration:none!important;
      font-size:inherit!important;
      font-family:inherit!important;
      font-weight:inherit!important;
      line-height:inherit!important;
    }
    .es-desk-hidden {
      display:none;
      float:left;
      overflow:hidden;
      width:0;
      max-height:0;
      line-height:0;
      mso-hide:all;
    }
    [data-ogsb] .es-button {
      border-width:0!important;
      padding:10px 25px 10px 30px!important;
    }
    .es-button-border:hover a.es-button, .es-button-border:hover button.es-button {
      background:#58dfec!important;
      border-color:#58dfec!important;
    }
    .es-button-border:hover {
      border-color:#26C6DA #26C6DA #26C6DA #26C6DA!important;
      background:#58dfec!important;
      border-style:solid solid solid solid!important;
    }
    @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:center } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:center } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    <!--[if !mso]><!-- -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet">
    <!--<![endif]-->
</head>

<body>
<div class="es-wrapper-color">
    <!--[if gte mso 9]>
      <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
      <v:fill type="tile" color="#07023c"></v:fill>
      </v:background>
    <![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
                <td class="esd-email-paddings" align="top">
                    <table class="es-content esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td class="esd-stripe" align="center">
                                    <table class="es-content-body" style="background-color: #ffffff; background-image: url(https://yvczvy.stripocdn.email/content/guids/CABINET_10a46408783042489135d8b269177e5f/images/rectangle_26.png); background-repeat: no-repeat; background-position: center top;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" background="https://yvczvy.stripocdn.email/content/guids/CABINET_10a46408783042489135d8b269177e5f/images/rectangle_26.png">
                                        <tbody>
                                            <tr>
                                                <td class="esd-structure es-p20t es-p20r es-p20l" align="left">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tbody>
                                                            <tr>
                                                                <td width="560" class="es-m-p0r esd-container-frame" valign="top" align="center">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank" href="https://alfonsogonz.es/new-empresas-ms"><img src="https://alfonsogonz.es/new-empresas-ms/assets/images/icon/apple-touch-icon.png" alt="Logo" style="display: block;" title="Logo" height="55"></a></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="esd-structure es-p20" align="left">
                                                    <table cellspacing="0" cellpadding="0" width="100%">
                                                        <tbody>
                                                            <tr>
                                                                <td width="560" align="left" class="esd-container-frame">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-image es-p20t es-p20b" style="font-size: 0px;"><a target="_blank" rel="noopener noreferrer nofollow" href="https://alfonsogonz.es/new-empresas-ms"><img src="https://alfonsogonz.es/new-empresas-ms/assets/images/background/weatherbg.jpg" alt style="display: block;" width="560"></a></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="es-m-p0r esd-container-frame" width="560" align="top" align="center">
                                                                    <table width="100%" cellspacing="0" cellpadding="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-text es-p20b">
                                                                                    <h2>Recuperar contraseña</h2>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td align="left" class="esd-block-text es-p20t es-p15b">
                                                                                    <p>Hola ${ name } ${ lastname };</p>
                                                                                    <p><br></p>
                                                                                    <p>Buscamos constantemente formas de mejorar la experiencia de nuestros usuarios y asegurarnos de que nuestras políticas expliquen cómo funcionan nuestros servicios. Por eso, le informamos sobre nuestros Términos de servicio y Política de privacidad.&nbsp;</p>
                                                                                    <p><br>Le enviamos una contraseña temporal, cambiarla lo antes posible mediante la aplicación<br><br><br></p>&nbsp;
                                                                                    <strong style="font-size: 20px;">${ password }</strong><p><br>Gracias!<br><br>Empresas Admin</p>
                                                                                    <p><br></p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table cellpadding="0" cellspacing="0" class="esd-footer-popover es-footer" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe es-stripe-html" align="center">
                                        <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: white;">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p20b es-p20r es-p20l" align="left" esd-custom-block-id="541043">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="left">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-social es-p10t es-p10b" style="font-size:0">
                                                                                        <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="center" align="top" class="es-p20r" esd-tmp-icon-type="facebook"><a target="_blank" href="https://www.facebook.com/alfonsojose.gonzalezdelgado"><img title="Facebook" src="https://alfonsogonz.es/new-empresas-ms/assets/images/icon/Logo_de_Facebook.png" alt="Fb" width="32" height="32"></a></td>
                                                                                                    <td align="center" align="top" class="es-p20r" esd-tmp-icon-type="twitter"><a target="_blank" href="https://twitter.com/alfonso8969"><img title="Twitter" src="https://alfonsogonz.es/new-empresas-ms/assets/images/icon/Logo_de_Twitter.png" alt="Tw" width="32" height="32"></a></td>
                                                                                                    <td align="center" align="top" esd-tmp-icon-type="instagram"><a target="_blank" href="https://www.instagram.com/alfonsojose8969/"><img title="Instagram" src="https://alfonsogonz.es/new-empresas-ms/assets/images/icon/Logo_de_Instagram.png" alt="Inst" width="32" height="32"></a></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-p10t es-p10b" esd-links-underline="underline">
                                                                                        <p style="font-size: 12px; color: green;">Está recibiendo este correo electrónico porque ha visitado nuestro sitio . Asegúrese de que nuestros mensajes lleguen a su bandeja de entrada (y no a sus carpetas masivas o basura).<a rel="noopener noreferrer nofollow" style="font-size: 12px; text-decoration: underline;" href="https://alfonsogonz.es/alf-blog/politica-de-privacidad/"> Política de privacidad</a> |<a href="mailto:info@alfgonsogonz.es" target="_blank" style="font-size: 12px; text-decoration: underline;">Darse de baja</a></p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="esd-structure es-p20" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="center" align="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-image" style="font-size: 0px;background-color: white"><a target="_blank"><img class="adapt-img" src="https://alfonsogonz.es/new-empresas-ms/assets/images/logo-text.png" alt style="display: block;" width="72"></a></td>
                                                                                    <br><p></p>
                                                                                    <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://alfonsogonz.es/new-empresas-ms/assets/images/logo-light-text.png" alt style="display: block;" width="72"></a></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</body>
</html>
    `
  }

  static getTemplateEmailCreateAccount(user_name: string, userEmail: string, arg2: string): string {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title></title>
    <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <style type="text/css">
    #outlook a {
      padding:0;
    }
    .es-button {
      mso-style-priority:100!important;
      text-decoration:none!important;
    }
    a[x-apple-data-detectors] {
      color:inherit!important;
      text-decoration:none!important;
      font-size:inherit!important;
      font-family:inherit!important;
      font-weight:inherit!important;
      line-height:inherit!important;
    }
    .es-desk-hidden {
      display:none;
      float:left;
      overflow:hidden;
      width:0;
      max-height:0;
      line-height:0;
      mso-hide:all;
    }
    [data-ogsb] .es-button {
      border-width:0!important;
      padding:10px 25px 10px 30px!important;
    }
    .es-button-border:hover a.es-button, .es-button-border:hover button.es-button {
      background:#58dfec!important;
      border-color:#58dfec!important;
    }
    .es-button-border:hover {
      border-color:#26C6DA #26C6DA #26C6DA #26C6DA!important;
      background:#58dfec!important;
      border-style:solid solid solid solid!important;
    }
    @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:center } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:center } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]-->
    <!--[if !mso]><!-- -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet">
    <!--<![endif]-->
</head>

<body>
<div class="es-wrapper-color">
    <!--[if gte mso 9]>
      <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
      <v:fill type="tile" color="#07023c"></v:fill>
      </v:background>
    <![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
                <td class="esd-email-paddings" align="top">
                    <table class="es-content esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td class="esd-stripe" align="center">
                                    <table class="es-content-body" style="background-color: #ffffff; background-image: url(https://yvczvy.stripocdn.email/content/guids/CABINET_10a46408783042489135d8b269177e5f/images/rectangle_26.png); background-repeat: no-repeat; background-position: center top;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" background="https://yvczvy.stripocdn.email/content/guids/CABINET_10a46408783042489135d8b269177e5f/images/rectangle_26.png">
                                        <tbody>
                                            <tr>
                                                <td class="esd-structure es-p20t es-p20r es-p20l" align="left">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tbody>
                                                            <tr>
                                                                <td width="560" class="es-m-p0r esd-container-frame" align="top" align="center">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank" href="https://alfonsogonz.es/new-empresas-ms"><img src="https://alfonsogonz.es/new-empresas-ms/assets/images/icon/apple-touch-icon.png" alt="Logo" style="display: block;" title="Logo" height="55"></a></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="esd-structure es-p20" align="left">
                                                    <table cellspacing="0" cellpadding="0" width="100%">
                                                        <tbody>
                                                            <tr>
                                                                <td width="560" align="left" class="esd-container-frame">
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-image es-p20t es-p20b" style="font-size: 0px;"><a target="_blank" rel="noopener noreferrer nofollow" href="https://alfonsogonz.es/new-empresas-ms"><img src="https://alfonsogonz.es/new-empresas-ms/assets/images/background/weatherbg.jpg" alt style="display: block;" width="560"></a></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="es-m-p0r esd-container-frame" width="560" align="top" align="center">
                                                                    <table width="100%" cellspacing="0" cellpadding="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" class="esd-block-text es-p20b">
                                                                                    <h2>Crear cuenta</h2>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td align="left" class="esd-block-text es-p20t es-p15b">
                                                                                    <p>Hola ${ user_name };</p>
                                                                                    <p>Email: ${ userEmail };</p>
                                                                                    <p><br></p>
                                                                                    <p>Buscamos constantemente formas de mejorar la experiencia de nuestros usuarios y asegurarnos de que nuestras políticas expliquen cómo funcionan nuestros servicios. Por eso, le informamos sobre nuestros Términos de servicio y Política de privacidad.&nbsp;</p>
                                                                                    <p><br>Por favor pulse en el enlace de abajo para completar este formulario..<br /> <a href="https://form.jotform.com/230067287676061">Rellenar formulario</a></p><br><br>
                                                                                    Le comunicaremos la confirmación de la inscripción por teléfono o email en unos días, por favor sea paciente.
                                                                                    </p>&nbsp;
                                                                                    <p><br>Muchísimas gracias,</p>
                                                                                    <p>Un saludo desde Empresas Admin</p>
                                                                                    <p><br></p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table cellpadding="0" cellspacing="0" class="esd-footer-popover es-footer" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe es-stripe-html" align="center">
                                        <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: white;">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p20t es-p20b es-p20r es-p20l" align="left" esd-custom-block-id="541043">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="left">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-social es-p10t es-p10b" style="font-size:0">
                                                                                        <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="center" align="top" class="es-p20r" esd-tmp-icon-type="facebook"><a target="_blank" href="https://www.facebook.com/alfonsojose.gonzalezdelgado"><img title="Facebook" src="https://alfonsogonz.es/new-empresas-ms/assets/images/icon/Logo_de_Facebook.png" alt="Fb" width="32" height="32"></a></td>
                                                                                                    <td align="center" align="top" class="es-p20r" esd-tmp-icon-type="twitter"><a target="_blank" href="https://twitter.com/alfonso8969"><img title="Twitter" src="https://alfonsogonz.es/new-empresas-ms/assets/images/icon/Logo_de_Twitter.png" alt="Tw" width="32" height="32"></a></td>
                                                                                                    <td align="center" align="top" esd-tmp-icon-type="instagram"><a target="_blank" href="https://www.instagram.com/alfonsojose8969/"><img title="Instagram" src="https://alfonsogonz.es/new-empresas-ms/assets/images/icon/Logo_de_Instagram.png" alt="Inst" width="32" height="32"></a></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-p10t es-p10b" esd-links-underline="underline">
                                                                                        <p style="font-size: 12px; color: green;">Está recibiendo este correo electrónico porque ha visitado nuestro sitio . Asegúrese de que nuestros mensajes lleguen a su bandeja de entrada (y no a sus carpetas masivas o basura).<a rel="noopener noreferrer nofollow" style="font-size: 12px; text-decoration: underline;" href="https://alfonsogonz.es/alf-blog/politica-de-privacidad/"> Política de privacidad</a> |<a href="mailto:info@alfgonsogonz.es" target="_blank" style="font-size: 12px; text-decoration: underline;">Darse de baja</a></p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="esd-structure es-p20" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="560" class="esd-container-frame" align="center" valign="top">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-image" style="font-size: 0px;backgroun-color: white"><a target="_blank"><img class="adapt-img" src="https://alfonsogonz.es/new-empresas-ms/assets/images/logo-text.png" alt style="display: block;" width="72"></a></td>
                                                                                    <br><p></p>
                                                                                    <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://alfonsogonz.es/new-empresas-ms/assets/images/logo-light-text.png" alt style="display: block;" width="72"></a></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</body>
</html>
    `;
  }
}
