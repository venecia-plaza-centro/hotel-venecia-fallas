/**
 * Textos legales facilitados por el hotel (Política de privacidad y Aviso
 * legal). Van aparte de ui.ts porque son largos y
 * estructurados. Los idiomas sin traducción (it/fr/de) usan el español.
 *
 * Cada sección es una lista de párrafos. Marcas dentro de un párrafo:
 *  - "• texto"  → elemento de lista
 *  - "## texto" → subtítulo dentro de la sección
 *  - {privacyLink} etc. y las URLs https:// se convierten en enlaces al pintar.
 */
import type { Locale } from '../consts';

export type LegalPageId = 'privacy' | 'legalnotice';

export interface LegalText {
  intro: string[];
  sections: { h: string; p: string[] }[];
  contact: string;
}

const ES: Record<LegalPageId, LegalText> = {
  privacy: {
    intro: [
      'De conformidad con el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016 y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales, le informamos de que los datos de carácter personal facilitados en el presente serán incorporados en un fichero titularidad y responsabilidad de Hotel Venecia de Valencia, S.L.U.',
    ],
    sections: [
      {
        h: '¿Quién es el responsable de sus datos?',
        p: [
          'Titular: Hotel Venecia de Valencia, S.L.U.',
          'CIF: B97052534',
          'Domicilio social: Pza. Ayuntamiento, 3, 46002 Valencia.',
          'Teléfono de contacto: +34 963 52 42 67',
          'Correo electrónico: reservas@hotelvenecia.com',
          'Web: https://hotelvenecia.com',
          'Por favor, tenga en cuenta que la presente Política de Privacidad no aborda, y no seremos responsables de, la privacidad, información u otras prácticas de terceros cualesquiera, incluidas las de toda parte que opere un portal hacia el que estos Portales contengan un enlace. La inclusión de un enlace en los Portales no implica aval del portal enlazado por nuestra parte ni por la de nuestras filiales.',
        ],
      },
      {
        h: 'Licitud del tratamiento de datos',
        p: [
          'Respetamos su privacidad. Por ello, solamente procesamos sus datos personales cuando estamos autorizados a hacerlo. Usted puede darnos su consentimiento para el tratamiento de sus datos personales, cuando el tratamiento así lo requiera. En otros supuestos, si usted emplea servicios de nuestra web que requieren sus datos para poder realizarse, estaremos autorizados a tratar sus datos para la ejecución de tal actividad. Un ejemplo de ello es el registro de entradas que recogemos para garantizar, por ejemplo, que nuestra página web opera sin fallos (incluyendo el mantenimiento técnico de la página web). En cualquier caso, le informaremos sobre el tratamiento de datos personales que se lleva a cabo, y por supuesto, sus derechos e intereses siempre serán tenidos en cuenta. En caso de que tenga cualquier consulta sobre sus datos personales, encontrará sus derechos de protección de datos más delante de esta misma página.',
        ],
      },
      {
        h: 'Propósito del tratamiento de los datos',
        p: [
          'No haremos pública la información personal sin consentimiento. No vendemos ni compartimos la información personal voluntariamente.',
          'Hotel Venecia de Valencia, S.L.U tratará sus datos como usuario, de manera manual y/o automatizada, para las siguientes finalidades específicas:',
          '• Gestionar y confirmar su reserva, procesar su pago, enviarle por correo electrónico la confirmación de la reserva, contactar con usted si es necesario y atender sus consultas.',
          '• Realizar informes estadísticos anónimos respecto a los hábitos de acceso y la actividad desarrollada por los usuarios en la web.',
          '• Llevar a cabo las actuaciones precisas para proteger los intereses de los clientes cuando así sea necesario, o el cumplimiento de las resoluciones judiciales y las medidas en ellas acordadas.',
          '• Remitir comunicaciones electrónicas con ofertas, promociones y noticias relacionadas con nuestra actividad, solo en el caso en que usted, como cliente lo haya consentido o no se haya opuesto expresamente.',
          'Al hacer una reserva recogemos su nombre, apellidos, email, teléfono, país (opcional), idioma, la habitación y fecha elegidas, el número de huéspedes y cualquier nota que nos indique.',
          'Si decide contactar con nosotros al margen de una relación contractual o sin registrarse, podrá hacerlo a través de la página web o el correo de contacto.',
          'Para poder tramitar correctamente su solicitud cuando contacte con nosotros, podremos solicitarle que nos facilite datos personales tales como su nombre, e-mail y cualquier otra información relacionada con su solicitud y su mensaje. De modo opcional, puede facilitar su dirección postal y/o número de teléfono. Recogemos la información solicitada con el fin exclusivo de gestionar correctamente su solicitud. Los datos no se emplearán para ninguna finalidad adicional ni se comunicarán a terceros sin su consentimiento expreso, salvo que estemos autorizados a ello por ley. Si no es obligatorio por ley conservar sus datos personales, éstos serán eliminados una vez se haya tramitado su solicitud.',
          'En el caso de que nos remita su cv trataremos sus datos con el fin de valorar y gestionar su solicitud de empleo y en su caso, llevar a cabo las actuaciones necesarias para la selección y contratación de personal, a fin de ofertarle puestos que se ajusten a su perfil.',
          'Por motivos técnicos, cada vez que su navegador accede a nuestra web, automáticamente se envía información a nuestro servidor (ej. datos de navegación). Parte de esta información se almacena en archivos de registro, como:',
          '• fecha de acceso',
          '• hora de acceso',
          '• URL de la página',
          '• versión del protocolo HTTP',
          '• archivos a los que se accede',
          '• volumen de datos transferidos',
          '• tipo de navegador de internet y su versión',
          '• tipo de sistema operativo',
          '• dirección IP (anonimizada)',
          'Los datos de navegación no incluyen datos personales. Únicamente analizamos los datos de navegación cuando sea necesario, especialmente para solucionar fallos en la operatividad de nuestra web o para resolver incidencias de seguridad. Almacenamos estos datos de forma indefinida.',
        ],
      },
      {
        h: 'Destinatarios de la cesión de datos',
        p: [
          'Únicamente cedemos los datos personales que recogemos a aquellos que son encargados de tratamiento y han formalizado con nuestra entidad un contrato de encargado de tratamiento de datos personales en el que se compromete al adecuado tratamiento de nuestros registros.',
          'Para prestar el servicio de reservas de esta web, Hotel Venecia de Valencia, S.L.U cuenta con los siguientes encargados del tratamiento:',
          '• Airtable: almacena los datos de las reservas (nombre, apellidos, email, teléfono, fechas y habitación).',
          '• Vercel: aloja la página web y ejecuta sus funciones.',
          '• Resend: envía por correo electrónico la confirmación de la reserva al cliente y el aviso de la reserva al hotel.',
          '• Redsys y Caixa Popular (entidad financiera del hotel): procesan el pago con tarjeta u otros medios de pago. Los datos de su tarjeta se introducen directamente en la pasarela de pago de Redsys: Hotel Venecia de Valencia, S.L.U no los recibe ni los almacena; solo recibe la confirmación de que el pago se ha realizado y su importe.',
          'Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo; en ese caso se aplican las garantías previstas por el Reglamento (UE) 2016/679 para las transferencias internacionales de datos.',
          'También podemos vernos en la situación de tener que ceder los datos personales cuando sea necesario para prestar el servicio o atender a la consulta que se haya solicitado, así como en los casos previstos en la ley.',
        ],
      },
      {
        h: 'Plazo de conservación de los datos personales',
        p: [
          'Hotel Venecia de Valencia, S.L.U conservará sus datos personales, como usuario, únicamente durante el tiempo necesario para la realización de las finalidades para las que fueron recogidos, mientras no revoque los consentimientos otorgados. Posteriormente, en caso de ser necesario, mantendrá la información bloqueada los plazos legalmente establecidos, en todo caso, durante 5 años, o el plazo establecido por ley para cualquier acción que pueda devenir del tratamiento.',
          'En el caso de los datos que nos facilite con el envío de su curriculum para acceder a un proceso de selección de personal, serán conservados durante 3 años desde la fecha de la última actualización. Transcurrido dicho periodo, sin que hayan sido actualizados, los datos serán suprimidos, salvo que nos indique lo contrario.',
        ],
      },
      {
        h: 'Derechos de los usuarios',
        p: [
          'Puede enviarnos un escrito a Hotel Venecia de Valencia, S.L.U, Pza. Ayuntamiento, 3, 46002 Valencia, o enviarnos un correo a reservas@hotelvenecia.com, para realizar cualquiera de las siguientes acciones:',
          '• Revocar los consentimientos otorgados.',
          '• Obtener confirmación acerca de si en Hotel Venecia de Valencia, S.L.U se están tratando datos personales que le conciernen o no.',
          '• Acceder a sus datos personales.',
          '• Rectificar los datos inexactos o incompletos.',
          '• Solicitar la supresión de sus datos cuando, entre otros motivos, los datos ya no sean necesarios para los fines que fueron recogidos.',
          '• Obtener de Hotel Venecia de Valencia, S.L.U la limitación del tratamiento de los datos cuando se cumpla alguna de las condiciones previstas en la normativa de protección de datos.',
          '• En determinadas circunstancias y por motivos relacionados con su situación particular al tratamiento de sus datos, los interesados podrán oponerse al tratamiento de sus datos. Hotel Venecia de Valencia, S.L.U dejará de tratar los datos, salvo por motivos legítimos imperiosos, o el ejercicio o la defensa de posibles reclamaciones.',
          '• Obtener intervención humana, a expresar su punto de vista y a impugnar las decisiones automatizadas adoptadas.',
          '• Solicitar la portabilidad de sus datos.',
          '• Reclamar ante la Agencia Española de Protección de Datos (https://www.agpd.es) cuando el interesado considere que Hotel Venecia de Valencia, S.L.U ha vulnerado los derechos que le son reconocidos por la normativa aplicable en protección de datos.',
        ],
      },
    ],
    contact: '¿Dudas sobre sus datos? Escríbanos:',
  },

  legalnotice: {
    intro: [
      'El titular de esta página es Hotel Venecia de Valencia, S.L.U. El domicilio de Hotel Venecia de Valencia, S.L.U es Pza. Ayuntamiento, 3, 46002 Valencia, teléfono +34 963 52 42 67. El correo de contacto de Hotel Venecia de Valencia, S.L.U es reservas@hotelvenecia.com.',
    ],
    sections: [
      {
        h: 'Datos del titular',
        p: [
          'Titular: Hotel Venecia de Valencia, S.L.U.',
          'CIF: B97052534',
          'Domicilio: Pza. Ayuntamiento, 3, 46002 Valencia.',
        ],
      },
      {
        h: 'Condiciones de uso',
        p: [
          'Si utiliza el contenido y/o los servicios de esta página se compromete a aceptar las siguientes condiciones de uso:',
          'Hotel Venecia de Valencia, S.L.U se reserva el derecho a modificar el contenido, la configuración y la presentación de esta página web sin avisar. Esta página podría contener enlaces a otras páginas externas y, si es así, Hotel Venecia de Valencia, S.L.U, no se hace responsable del contenido y la configuración de tales páginas.',
        ],
      },
      {
        h: 'Propiedad intelectual',
        p: [
          'Los textos, imágenes, logotipos y el resto de contenidos de esta web son propiedad de Hotel Venecia de Valencia, S.L.U. Si no se indica lo contrario, no se puede transmitir, distribuir, reproducir o conservar los contenidos de esta página sin el consentimiento de Hotel Venecia de Valencia, S.L.U.',
        ],
      },
      {
        h: 'Exclusión de responsabilidad',
        p: [
          'Hotel Venecia de Valencia, S.L.U no se hace responsable de los posibles daños que se puedan producir por utilizar versiones no actualizadas de los navegadores, ni de las consecuencias que se derivan del mal funcionamiento de los navegadores por una configuración inadecuada, por la presencia de virus informáticos o por cualquier otra causa.',
        ],
      },
      {
        h: 'Legislación aplicable',
        p: [
          'El presente Aviso Legal se rige por la ley española. Cualquier conflicto relacionado con el uso de esta página será competencia de los juzgados y tribunales españoles.',
        ],
      },
    ],
    contact: '¿Alguna consulta? Escríbanos:',
  },

};

// English version: faithful translation of the Spanish text above.
const EN: Record<LegalPageId, LegalText> = {
  privacy: {
    intro: [
      'In accordance with Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 and Organic Law 3/2018 of 5 December on the Protection of Personal Data and the guarantee of digital rights, we inform you that the personal data provided here will be included in a file owned by and under the responsibility of Hotel Venecia de Valencia, S.L.U.',
    ],
    sections: [
      {
        h: 'Who is responsible for your data?',
        p: [
          'Data controller: Hotel Venecia de Valencia, S.L.U.',
          'Tax ID (CIF): B97052534',
          'Registered address: Pza. Ayuntamiento, 3, 46002 Valencia, Spain.',
          'Contact telephone: +34 963 52 42 67',
          'Email: reservas@hotelvenecia.com',
          'Website: https://hotelvenecia.com',
          'Please note that this Privacy Policy does not cover, and we are not responsible for, the privacy, information or other practices of any third parties, including any party operating a website to which our sites link. The inclusion of a link does not imply endorsement of the linked website by us or by our affiliates.',
        ],
      },
      {
        h: 'Lawfulness of data processing',
        p: [
          'We respect your privacy, so we only process your personal data when we are authorised to do so. You may give us your consent to process your personal data where the processing requires it. In other cases, if you use services on our website that require your data, we are authorised to process it to carry out that activity. An example is the access log we keep to make sure, for instance, that our website runs without faults (including its technical maintenance). In any case, we will inform you about the processing of personal data carried out, and your rights and interests will always be taken into account. If you have any question about your personal data, you will find your data protection rights further down this page.',
        ],
      },
      {
        h: 'Purpose of the data processing',
        p: [
          'We will not make personal information public without consent. We do not sell or voluntarily share personal information.',
          'Hotel Venecia de Valencia, S.L.U will process your data as a user, manually and/or automatically, for the following specific purposes:',
          '• Managing and confirming your booking, processing your payment, sending you the booking confirmation by email, contacting you if necessary and answering your enquiries.',
          '• Producing anonymous statistical reports on access habits and user activity on the website.',
          '• Carrying out the actions needed to protect customers’ interests when necessary, or to comply with court rulings and the measures agreed in them.',
          '• Sending electronic communications with offers, promotions and news related to our business, only where you, as a customer, have consented or have not expressly objected.',
          'When you make a booking we collect your first name, surname, email, telephone number, country (optional), language, the room and date chosen, the number of guests and any note you give us.',
          'If you decide to contact us outside a contractual relationship or without registering, you can do so through the website or the contact email.',
          'To handle your request properly when you contact us, we may ask you for personal data such as your name, email and any other information related to your request and message. Optionally, you may provide your postal address and/or telephone number. We collect the requested information for the sole purpose of handling your request properly. The data will not be used for any additional purpose or shared with third parties without your express consent, unless we are authorised to do so by law. If the law does not require us to keep your personal data, it will be deleted once your request has been handled.',
          'If you send us your CV, we will process your data to assess and manage your job application and, where applicable, carry out the actions needed for selecting and hiring staff, in order to offer you positions that match your profile.',
          'For technical reasons, every time your browser accesses our website, information is automatically sent to our server (e.g. browsing data). Part of this information is stored in log files, such as:',
          '• date of access',
          '• time of access',
          '• page URL',
          '• HTTP protocol version',
          '• files accessed',
          '• volume of data transferred',
          '• type and version of internet browser',
          '• type of operating system',
          '• IP address (anonymised)',
          'Browsing data does not include personal data. We only analyse browsing data when necessary, especially to fix faults in the operation of our website or to resolve security incidents. We store this data indefinitely.',
        ],
      },
      {
        h: 'Recipients of data transfers',
        p: [
          'We only pass on the personal data we collect to data processors who have signed a data processing agreement with us committing them to handle our records appropriately.',
          'To provide the booking service on this website, Hotel Venecia de Valencia, S.L.U uses the following data processors:',
          '• Airtable: stores the booking data (first name, surname, email, telephone number, dates and room).',
          '• Vercel: hosts the website and runs its functions.',
          '• Resend: sends the booking confirmation to the customer and the booking notice to the hotel by email.',
          '• Redsys and Caixa Popular (the hotel’s bank): process the payment by card or other payment methods. Your card details are entered directly on the Redsys payment gateway: Hotel Venecia de Valencia, S.L.U does not receive or store them; it only receives confirmation that the payment has been made and its amount.',
          'Some of these providers may process data outside the European Economic Area; in that case, the safeguards provided by Regulation (EU) 2016/679 for international data transfers apply.',
          'We may also have to disclose personal data when necessary to provide the service or answer the enquiry requested, and in the cases provided for by law.',
        ],
      },
      {
        h: 'Retention period of personal data',
        p: [
          'Hotel Venecia de Valencia, S.L.U will keep your personal data, as a user, only for the time necessary to fulfil the purposes for which it was collected, as long as you do not withdraw the consent given. Afterwards, if necessary, it will keep the information blocked for the legally established periods, in any case for 5 years, or the period set by law for any action that may arise from the processing.',
          'Data you provide by sending your CV to take part in a recruitment process will be kept for 3 years from the date of the last update. After that period, if it has not been updated, the data will be deleted, unless you tell us otherwise.',
        ],
      },
      {
        h: 'User rights',
        p: [
          'You can write to Hotel Venecia de Valencia, S.L.U, Pza. Ayuntamiento, 3, 46002 Valencia, Spain, or email us at reservas@hotelvenecia.com, to do any of the following:',
          '• Withdraw the consents given.',
          '• Obtain confirmation of whether or not Hotel Venecia de Valencia, S.L.U is processing personal data concerning you.',
          '• Access your personal data.',
          '• Rectify inaccurate or incomplete data.',
          '• Request the deletion of your data when, among other reasons, the data are no longer necessary for the purposes for which they were collected.',
          '• Obtain from Hotel Venecia de Valencia, S.L.U the restriction of the processing of your data when any of the conditions set out in data protection regulations is met.',
          '• In certain circumstances and for reasons relating to your particular situation, data subjects may object to the processing of their data. Hotel Venecia de Valencia, S.L.U will stop processing the data, except for compelling legitimate grounds or the exercise or defence of possible claims.',
          '• Obtain human intervention, express your point of view and challenge automated decisions taken.',
          '• Request the portability of your data.',
          '• Lodge a complaint with the Spanish Data Protection Agency (https://www.agpd.es) if you consider that Hotel Venecia de Valencia, S.L.U has infringed the rights recognised to you by the applicable data protection regulations.',
        ],
      },
    ],
    contact: 'Questions about your data? Write to us:',
  },

  legalnotice: {
    intro: [
      'The owner of this website is Hotel Venecia de Valencia, S.L.U. Its address is Pza. Ayuntamiento, 3, 46002 Valencia, Spain, telephone +34 963 52 42 67. Its contact email is reservas@hotelvenecia.com.',
    ],
    sections: [
      {
        h: 'Owner details',
        p: [
          'Owner: Hotel Venecia de Valencia, S.L.U.',
          'Tax ID (CIF): B97052534',
          'Address: Pza. Ayuntamiento, 3, 46002 Valencia, Spain.',
        ],
      },
      {
        h: 'Terms of use',
        p: [
          'By using the content and/or services of this website you agree to accept the following terms of use:',
          'Hotel Venecia de Valencia, S.L.U reserves the right to modify the content, configuration and presentation of this website without notice. This website may contain links to external websites and, if so, Hotel Venecia de Valencia, S.L.U is not responsible for the content and configuration of those websites.',
        ],
      },
      {
        h: 'Intellectual property',
        p: [
          'The texts, images, logos and other content of this website are the property of Hotel Venecia de Valencia, S.L.U. Unless otherwise stated, the content of this website may not be transmitted, distributed, reproduced or stored without the consent of Hotel Venecia de Valencia, S.L.U.',
        ],
      },
      {
        h: 'Exclusion of liability',
        p: [
          'Hotel Venecia de Valencia, S.L.U is not responsible for any damage that may result from using outdated browser versions, nor for the consequences of browser malfunction due to incorrect configuration, computer viruses or any other cause.',
        ],
      },
      {
        h: 'Applicable law',
        p: [
          'This Legal Notice is governed by Spanish law. Any dispute relating to the use of this website will fall under the jurisdiction of the Spanish courts.',
        ],
      },
    ],
    contact: 'Any questions? Write to us:',
  },

};

const TEXTS: Partial<Record<Locale, Record<LegalPageId, LegalText>>> = { es: ES, en: EN };

export function isLegalTextPage(id: string): id is LegalPageId {
  return id === 'privacy' || id === 'legalnotice';
}

/** Texto en el idioma pedido; it/fr/de (sin traducir) usan el español. */
export function legalText(lang: Locale, id: LegalPageId): LegalText {
  return (TEXTS[lang] ?? ES)[id];
}
