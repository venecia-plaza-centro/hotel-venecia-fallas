/**
 * Textos legales facilitados por el hotel (Política de privacidad y Aviso
 * legal). Van aparte de ui.ts porque son largos y
 * estructurados. Traducidos a los 5 idiomas (es/en/it/fr/de).
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

// Versione italiana: traduzione fedele del testo spagnolo sopra.
const IT: Record<LegalPageId, LegalText> = {
  privacy: {
    intro: [
      'In conformità al Regolamento (UE) 2016/679 del Parlamento Europeo e del Consiglio del 27 aprile 2016 e alla Legge Organica 3/2018, del 5 dicembre, sulla Protezione dei Dati Personali e garanzia dei diritti digitali, la informiamo che i dati di carattere personale forniti nel presente documento saranno inclusi in un archivio di proprietà e responsabilità di Hotel Venecia de Valencia, S.L.U.',
    ],
    sections: [
      {
        h: 'Chi è responsabile dei suoi dati?',
        p: [
          'Titolare: Hotel Venecia de Valencia, S.L.U.',
          'CIF: B97052534',
          'Sede legale: Pza. Ayuntamiento, 3, 46002 Valencia.',
          'Telefono di contatto: +34 963 52 42 67',
          'Email: reservas@hotelvenecia.com',
          'Sito web: https://hotelvenecia.com',
          'La preghiamo di tenere presente che la presente Informativa sulla Privacy non riguarda, e non saremo responsabili per, la privacy, le informazioni o altre pratiche di terzi, incluse quelle di qualsiasi parte che gestisca un sito web a cui i nostri portali contengano un collegamento. L’inclusione di un collegamento nei Portali non implica l’approvazione del sito collegato da parte nostra né delle nostre affiliate.',
        ],
      },
      {
        h: 'Liceità del trattamento dei dati',
        p: [
          'Rispettiamo la sua privacy. Per questo trattiamo i suoi dati personali solo quando siamo autorizzati a farlo. Lei può darci il suo consenso al trattamento dei suoi dati personali, quando il trattamento lo richieda. In altri casi, se utilizza servizi del nostro sito web che richiedono i suoi dati per poter essere svolti, saremo autorizzati a trattare i suoi dati per l’esecuzione di tale attività. Un esempio è il registro degli accessi che raccogliamo per garantire, ad esempio, che il nostro sito web funzioni senza errori (compresa la manutenzione tecnica del sito web). In ogni caso, la informeremo sul trattamento dei dati personali effettuato e, naturalmente, i suoi diritti e interessi saranno sempre presi in considerazione. In caso di qualsiasi dubbio sui suoi dati personali, troverà i suoi diritti di protezione dei dati più avanti in questa stessa pagina.',
        ],
      },
      {
        h: 'Finalità del trattamento dei dati',
        p: [
          'Non renderemo pubbliche le informazioni personali senza consenso. Non vendiamo né condividiamo volontariamente le informazioni personali.',
          'Hotel Venecia de Valencia, S.L.U tratterà i suoi dati come utente, in modo manuale e/o automatizzato, per le seguenti finalità specifiche:',
          '• Gestire e confermare la sua prenotazione, elaborare il pagamento, inviarle via email la conferma della prenotazione, contattarla se necessario e rispondere alle sue richieste.',
          '• Realizzare report statistici anonimi sulle abitudini di accesso e sull’attività svolta dagli utenti sul sito web.',
          '• Svolgere le azioni necessarie per proteggere gli interessi dei clienti quando sia necessario, o per adempiere alle decisioni giudiziarie e alle misure in esse concordate.',
          '• Inviare comunicazioni elettroniche con offerte, promozioni e notizie relative alla nostra attività, solo nel caso in cui lei, come cliente, lo abbia consentito o non vi si sia espressamente opposto.',
          'Al momento della prenotazione raccogliamo nome, cognome, email, telefono, paese (facoltativo), lingua, camera e data scelte, numero di ospiti ed eventuali note indicate.',
          'Se decide di contattarci al di fuori di un rapporto contrattuale o senza registrarsi, può farlo tramite il sito web o l’email di contatto.',
          'Per poter gestire correttamente la sua richiesta quando ci contatta, potremmo chiederle di fornirci dati personali come nome, email e qualsiasi altra informazione relativa alla sua richiesta e al suo messaggio. Facoltativamente, può fornire il suo indirizzo postale e/o numero di telefono. Raccogliamo le informazioni richieste al solo scopo di gestire correttamente la sua richiesta. I dati non saranno utilizzati per nessuna finalità aggiuntiva né comunicati a terzi senza il suo consenso espresso, salvo che ne siamo autorizzati per legge. Se non è obbligatorio per legge conservare i suoi dati personali, questi saranno eliminati una volta gestita la sua richiesta.',
          'Nel caso in cui ci invii il suo curriculum, tratteremo i suoi dati al fine di valutare e gestire la sua candidatura e, se del caso, svolgere le azioni necessarie per la selezione e l’assunzione del personale, per offrirle posizioni adatte al suo profilo.',
          'Per motivi tecnici, ogni volta che il suo browser accede al nostro sito web, vengono automaticamente inviate informazioni al nostro server (ad es. dati di navigazione). Parte di queste informazioni viene memorizzata in file di registro, come:',
          '• data di accesso',
          '• ora di accesso',
          '• URL della pagina',
          '• versione del protocollo HTTP',
          '• file a cui si accede',
          '• volume di dati trasferiti',
          '• tipo di browser internet e sua versione',
          '• tipo di sistema operativo',
          '• indirizzo IP (anonimizzato)',
          'I dati di navigazione non includono dati personali. Analizziamo i dati di navigazione solo quando necessario, in particolare per risolvere guasti nel funzionamento del nostro sito web o per risolvere incidenti di sicurezza. Conserviamo questi dati a tempo indeterminato.',
        ],
      },
      {
        h: 'Destinatari della comunicazione dei dati',
        p: [
          'Comunichiamo i dati personali raccolti unicamente a chi svolge attività di trattamento e ha formalizzato con la nostra entità un contratto di responsabile del trattamento dei dati personali, impegnandosi al corretto trattamento dei nostri registri.',
          'Per fornire il servizio di prenotazione di questo sito web, Hotel Venecia de Valencia, S.L.U si avvale dei seguenti responsabili del trattamento:',
          '• Airtable: memorizza i dati delle prenotazioni (nome, cognome, email, telefono, date e camera).',
          '• Vercel: ospita il sito web ed esegue le sue funzioni.',
          '• Resend: invia via email la conferma della prenotazione al cliente e l’avviso della prenotazione all’hotel.',
          '• Redsys e Caixa Popular (entità finanziaria dell’hotel): elaborano il pagamento con carta o altri mezzi di pagamento. I dati della sua carta vengono inseriti direttamente nel gateway di pagamento di Redsys: Hotel Venecia de Valencia, S.L.U non li riceve né li memorizza; riceve solo la conferma che il pagamento è stato effettuato e il relativo importo.',
          'Alcuni di questi fornitori possono trattare dati al di fuori dello Spazio Economico Europeo; in tal caso si applicano le garanzie previste dal Regolamento (UE) 2016/679 per i trasferimenti internazionali di dati.',
          'Potremmo inoltre dover comunicare i dati personali quando necessario per fornire il servizio o rispondere alla richiesta effettuata, nonché nei casi previsti dalla legge.',
        ],
      },
      {
        h: 'Periodo di conservazione dei dati personali',
        p: [
          'Hotel Venecia de Valencia, S.L.U conserverà i suoi dati personali, come utente, unicamente per il tempo necessario al raggiungimento delle finalità per cui sono stati raccolti, finché non revochi i consensi concessi. Successivamente, se necessario, manterrà le informazioni bloccate per i termini legalmente stabiliti, in ogni caso per 5 anni, o il termine stabilito dalla legge per qualsiasi azione che possa derivare dal trattamento.',
          'Nel caso dei dati forniti con l’invio del curriculum per partecipare a un processo di selezione del personale, saranno conservati per 3 anni dalla data dell’ultimo aggiornamento. Trascorso tale periodo, senza che siano stati aggiornati, i dati saranno cancellati, salvo diversa indicazione da parte sua.',
        ],
      },
      {
        h: 'Diritti degli utenti',
        p: [
          'Può inviarci uno scritto a Hotel Venecia de Valencia, S.L.U, Pza. Ayuntamiento, 3, 46002 Valencia, o un’email a reservas@hotelvenecia.com, per esercitare uno qualsiasi dei seguenti diritti:',
          '• Revocare i consensi concessi.',
          '• Ottenere conferma se Hotel Venecia de Valencia, S.L.U stia trattando o meno dati personali che la riguardano.',
          '• Accedere ai suoi dati personali.',
          '• Rettificare i dati inesatti o incompleti.',
          '• Richiedere la cancellazione dei suoi dati quando, tra gli altri motivi, i dati non siano più necessari per le finalità per cui sono stati raccolti.',
          '• Ottenere da Hotel Venecia de Valencia, S.L.U la limitazione del trattamento dei dati quando si verifichi una delle condizioni previste dalla normativa sulla protezione dei dati.',
          '• In determinate circostanze e per motivi legati alla sua situazione particolare, gli interessati potranno opporsi al trattamento dei loro dati. Hotel Venecia de Valencia, S.L.U cesserà di trattare i dati, salvo motivi legittimi cogenti, o per l’esercizio o la difesa di eventuali reclami.',
          '• Ottenere l’intervento umano, esprimere il proprio punto di vista e contestare le decisioni automatizzate adottate.',
          '• Richiedere la portabilità dei suoi dati.',
          '• Presentare reclamo all’Agenzia Spagnola per la Protezione dei Dati (https://www.agpd.es) qualora ritenga che Hotel Venecia de Valencia, S.L.U abbia violato i diritti riconosciutigli dalla normativa applicabile in materia di protezione dei dati.',
        ],
      },
    ],
    contact: 'Domande sui suoi dati? Ci scriva:',
  },

  legalnotice: {
    intro: [
      'Il titolare di questo sito web è Hotel Venecia de Valencia, S.L.U. Il domicilio di Hotel Venecia de Valencia, S.L.U è Pza. Ayuntamiento, 3, 46002 Valencia, telefono +34 963 52 42 67. L’email di contatto di Hotel Venecia de Valencia, S.L.U è reservas@hotelvenecia.com.',
    ],
    sections: [
      {
        h: 'Dati del titolare',
        p: [
          'Titolare: Hotel Venecia de Valencia, S.L.U.',
          'CIF: B97052534',
          'Domicilio: Pza. Ayuntamiento, 3, 46002 Valencia.',
        ],
      },
      {
        h: 'Condizioni d’uso',
        p: [
          'Utilizzando il contenuto e/o i servizi di questo sito web, lei si impegna ad accettare le seguenti condizioni d’uso:',
          'Hotel Venecia de Valencia, S.L.U si riserva il diritto di modificare il contenuto, la configurazione e la presentazione di questo sito web senza preavviso. Questo sito web potrebbe contenere collegamenti ad altri siti esterni e, in tal caso, Hotel Venecia de Valencia, S.L.U non si assume alcuna responsabilità per il contenuto e la configurazione di tali siti.',
        ],
      },
      {
        h: 'Proprietà intellettuale',
        p: [
          'I testi, le immagini, i loghi e il resto dei contenuti di questo sito web sono di proprietà di Hotel Venecia de Valencia, S.L.U. Salvo diversa indicazione, non è consentito trasmettere, distribuire, riprodurre o conservare i contenuti di questa pagina senza il consenso di Hotel Venecia de Valencia, S.L.U.',
        ],
      },
      {
        h: 'Esclusione di responsabilità',
        p: [
          'Hotel Venecia de Valencia, S.L.U non si assume alcuna responsabilità per eventuali danni derivanti dall’utilizzo di versioni non aggiornate dei browser, né per le conseguenze derivanti dal malfunzionamento dei browser dovuto a una configurazione inadeguata, alla presenza di virus informatici o a qualsiasi altra causa.',
        ],
      },
      {
        h: 'Legislazione applicabile',
        p: [
          'Il presente Avviso Legale è disciplinato dalla legge spagnola. Qualsiasi controversia relativa all’uso di questo sito web sarà di competenza dei tribunali spagnoli.',
        ],
      },
    ],
    contact: 'Qualche domanda? Ci scriva:',
  },
};

// Version française : traduction fidèle du texte espagnol ci-dessus.
const FR: Record<LegalPageId, LegalText> = {
  privacy: {
    intro: [
      'Conformément au règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 et à la loi organique 3/2018 du 5 décembre relative à la protection des données personnelles et à la garantie des droits numériques, nous vous informons que les données à caractère personnel fournies ici seront intégrées à un fichier détenu et sous la responsabilité de Hotel Venecia de Valencia, S.L.U.',
    ],
    sections: [
      {
        h: 'Qui est responsable de vos données ?',
        p: [
          'Responsable du traitement : Hotel Venecia de Valencia, S.L.U.',
          'Numéro fiscal (CIF) : B97052534',
          'Siège social : Pza. Ayuntamiento, 3, 46002 Valence.',
          'Téléphone de contact : +34 963 52 42 67',
          'Email : reservas@hotelvenecia.com',
          'Site web : https://hotelvenecia.com',
          'Veuillez noter que la présente politique de confidentialité ne couvre pas, et que nous ne sommes pas responsables de la confidentialité, des informations ou d’autres pratiques de tiers, y compris de toute partie exploitant un site web vers lequel nos portails renvoient. L’inclusion d’un lien dans les portails n’implique pas d’approbation du site lié de notre part ni de celle de nos filiales.',
        ],
      },
      {
        h: 'Licéité du traitement des données',
        p: [
          'Nous respectons votre vie privée. C’est pourquoi nous ne traitons vos données personnelles que lorsque nous y sommes autorisés. Vous pouvez nous donner votre consentement pour le traitement de vos données personnelles, lorsque le traitement l’exige. Dans d’autres cas, si vous utilisez des services de notre site web qui nécessitent vos données pour pouvoir être réalisés, nous serons autorisés à traiter vos données pour l’exécution de cette activité. Un exemple en est le journal des accès que nous conservons pour garantir, par exemple, que notre site web fonctionne sans problème (y compris sa maintenance technique). Dans tous les cas, nous vous informerons du traitement des données personnelles effectué et, bien entendu, vos droits et intérêts seront toujours pris en compte. Pour toute question concernant vos données personnelles, vous trouverez vos droits en matière de protection des données plus loin sur cette même page.',
        ],
      },
      {
        h: 'Finalité du traitement des données',
        p: [
          'Nous ne rendrons pas publiques les informations personnelles sans consentement. Nous ne vendons ni ne partageons volontairement les informations personnelles.',
          'Hotel Venecia de Valencia, S.L.U traitera vos données en tant qu’utilisateur, de manière manuelle et/ou automatisée, aux fins spécifiques suivantes :',
          '• Gérer et confirmer votre réservation, traiter votre paiement, vous envoyer par email la confirmation de la réservation, vous contacter si nécessaire et répondre à vos demandes.',
          '• Réaliser des rapports statistiques anonymes sur les habitudes d’accès et l’activité des utilisateurs sur le site web.',
          '• Mener à bien les actions nécessaires pour protéger les intérêts des clients lorsque cela est nécessaire, ou pour se conformer aux décisions judiciaires et aux mesures qui y sont convenues.',
          '• Envoyer des communications électroniques avec des offres, promotions et actualités liées à notre activité, uniquement si vous, en tant que client, y avez consenti ou ne vous y êtes pas expressément opposé.',
          'Lors d’une réservation, nous recueillons votre nom, prénom, email, téléphone, pays (facultatif), langue, la chambre et la date choisies, le nombre d’invités et toute note que vous nous indiquez.',
          'Si vous décidez de nous contacter en dehors d’une relation contractuelle ou sans vous inscrire, vous pouvez le faire via le site web ou l’email de contact.',
          'Pour pouvoir traiter correctement votre demande lorsque vous nous contactez, nous pourrons vous demander de nous fournir des données personnelles telles que votre nom, votre email et toute autre information liée à votre demande et à votre message. Vous pouvez éventuellement fournir votre adresse postale et/ou votre numéro de téléphone. Nous recueillons les informations demandées dans le seul but de traiter correctement votre demande. Les données ne seront utilisées à aucune autre fin ni communiquées à des tiers sans votre consentement exprès, sauf si nous y sommes autorisés par la loi. Si la loi n’exige pas la conservation de vos données personnelles, celles-ci seront supprimées une fois votre demande traitée.',
          'Si vous nous faites parvenir votre CV, nous traiterons vos données afin d’évaluer et de gérer votre candidature et, le cas échéant, de mener les actions nécessaires à la sélection et au recrutement de personnel, afin de vous proposer des postes correspondant à votre profil.',
          'Pour des raisons techniques, chaque fois que votre navigateur accède à notre site web, des informations sont automatiquement envoyées à notre serveur (par ex. données de navigation). Une partie de ces informations est stockée dans des fichiers journaux, tels que :',
          '• date d’accès',
          '• heure d’accès',
          '• URL de la page',
          '• version du protocole HTTP',
          '• fichiers consultés',
          '• volume de données transférées',
          '• type de navigateur internet et sa version',
          '• type de système d’exploitation',
          '• adresse IP (anonymisée)',
          'Les données de navigation n’incluent pas de données personnelles. Nous n’analysons les données de navigation que lorsque cela est nécessaire, notamment pour résoudre des dysfonctionnements de notre site web ou pour résoudre des incidents de sécurité. Nous conservons ces données indéfiniment.',
        ],
      },
      {
        h: 'Destinataires de la cession des données',
        p: [
          'Nous ne cédons les données personnelles que nous collectons qu’aux sous-traitants ayant formalisé avec notre entité un contrat de sous-traitance des données personnelles, par lequel ils s’engagent au traitement adéquat de nos registres.',
          'Pour fournir le service de réservation de ce site web, Hotel Venecia de Valencia, S.L.U fait appel aux sous-traitants suivants :',
          '• Airtable : stocke les données des réservations (nom, prénom, email, téléphone, dates et chambre).',
          '• Vercel : héberge le site web et exécute ses fonctions.',
          '• Resend : envoie par email la confirmation de la réservation au client et l’avis de réservation à l’hôtel.',
          '• Redsys et Caixa Popular (entité financière de l’hôtel) : traitent le paiement par carte ou autres moyens de paiement. Les données de votre carte sont saisies directement sur la passerelle de paiement de Redsys : Hotel Venecia de Valencia, S.L.U ne les reçoit ni ne les stocke ; il reçoit uniquement la confirmation que le paiement a été effectué et son montant.',
          'Certains de ces prestataires peuvent traiter des données en dehors de l’Espace économique européen ; dans ce cas, les garanties prévues par le règlement (UE) 2016/679 pour les transferts internationaux de données s’appliquent.',
          'Nous pourrions également devoir céder des données personnelles lorsque cela est nécessaire pour fournir le service ou répondre à la demande formulée, ainsi que dans les cas prévus par la loi.',
        ],
      },
      {
        h: 'Durée de conservation des données personnelles',
        p: [
          'Hotel Venecia de Valencia, S.L.U conservera vos données personnelles, en tant qu’utilisateur, uniquement pendant le temps nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, tant que vous ne révoquez pas les consentements accordés. Ensuite, si nécessaire, il conservera les informations bloquées pendant les délais légalement établis, en tout état de cause pendant 5 ans, ou le délai établi par la loi pour toute action pouvant découler du traitement.',
          'Dans le cas des données que vous nous fournissez en envoyant votre CV pour participer à un processus de recrutement, elles seront conservées pendant 3 ans à compter de la date de la dernière mise à jour. Passé ce délai, si elles n’ont pas été mises à jour, les données seront supprimées, sauf indication contraire de votre part.',
        ],
      },
      {
        h: 'Droits des utilisateurs',
        p: [
          'Vous pouvez nous adresser un courrier à Hotel Venecia de Valencia, S.L.U, Pza. Ayuntamiento, 3, 46002 Valence, ou un email à reservas@hotelvenecia.com, pour exercer l’un quelconque des droits suivants :',
          '• Révoquer les consentements accordés.',
          '• Obtenir confirmation que Hotel Venecia de Valencia, S.L.U traite ou non des données personnelles vous concernant.',
          '• Accéder à vos données personnelles.',
          '• Rectifier les données inexactes ou incomplètes.',
          '• Demander la suppression de vos données lorsque, entre autres motifs, les données ne sont plus nécessaires aux fins pour lesquelles elles ont été collectées.',
          '• Obtenir de Hotel Venecia de Valencia, S.L.U la limitation du traitement des données lorsque l’une des conditions prévues par la réglementation sur la protection des données est remplie.',
          '• Dans certaines circonstances et pour des raisons liées à leur situation particulière, les personnes concernées pourront s’opposer au traitement de leurs données. Hotel Venecia de Valencia, S.L.U cessera de traiter les données, sauf motifs légitimes impérieux, ou l’exercice ou la défense d’éventuelles réclamations.',
          '• Obtenir une intervention humaine, exprimer votre point de vue et contester les décisions automatisées prises.',
          '• Demander la portabilité de vos données.',
          '• Introduire une réclamation auprès de l’Agence espagnole de protection des données (https://www.agpd.es) si vous estimez que Hotel Venecia de Valencia, S.L.U a porté atteinte aux droits qui vous sont reconnus par la réglementation applicable en matière de protection des données.',
        ],
      },
    ],
    contact: 'Des questions sur vos données ? Écrivez-nous :',
  },

  legalnotice: {
    intro: [
      'Le titulaire de ce site web est Hotel Venecia de Valencia, S.L.U. Le domicile de Hotel Venecia de Valencia, S.L.U est Pza. Ayuntamiento, 3, 46002 Valence, téléphone +34 963 52 42 67. L’email de contact de Hotel Venecia de Valencia, S.L.U est reservas@hotelvenecia.com.',
    ],
    sections: [
      {
        h: 'Informations sur le titulaire',
        p: [
          'Titulaire : Hotel Venecia de Valencia, S.L.U.',
          'Numéro fiscal (CIF) : B97052534',
          'Domicile : Pza. Ayuntamiento, 3, 46002 Valence.',
        ],
      },
      {
        h: 'Conditions d’utilisation',
        p: [
          'En utilisant le contenu et/ou les services de ce site web, vous vous engagez à accepter les conditions d’utilisation suivantes :',
          'Hotel Venecia de Valencia, S.L.U se réserve le droit de modifier le contenu, la configuration et la présentation de ce site web sans préavis. Ce site web peut contenir des liens vers d’autres sites externes et, le cas échéant, Hotel Venecia de Valencia, S.L.U n’est pas responsable du contenu et de la configuration de ces sites.',
        ],
      },
      {
        h: 'Propriété intellectuelle',
        p: [
          'Les textes, images, logos et autres contenus de ce site web sont la propriété de Hotel Venecia de Valencia, S.L.U. Sauf indication contraire, il n’est pas permis de transmettre, distribuer, reproduire ou conserver les contenus de cette page sans le consentement de Hotel Venecia de Valencia, S.L.U.',
        ],
      },
      {
        h: 'Exclusion de responsabilité',
        p: [
          'Hotel Venecia de Valencia, S.L.U n’est pas responsable des dommages éventuels pouvant résulter de l’utilisation de versions non mises à jour des navigateurs, ni des conséquences découlant d’un mauvais fonctionnement des navigateurs dû à une configuration inadéquate, à la présence de virus informatiques ou à toute autre cause.',
        ],
      },
      {
        h: 'Législation applicable',
        p: [
          'Le présent avis légal est régi par le droit espagnol. Tout litige relatif à l’utilisation de ce site web relèvera de la compétence des tribunaux espagnols.',
        ],
      },
    ],
    contact: 'Une question ? Écrivez-nous :',
  },
};

// Deutsche Version: originalgetreue Übersetzung des spanischen Textes oben.
const DE: Record<LegalPageId, LegalText> = {
  privacy: {
    intro: [
      'Gemäß der Verordnung (EU) 2016/679 des Europäischen Parlaments und des Rates vom 27. April 2016 sowie dem Organgesetz 3/2018 vom 5. Dezember über den Schutz personenbezogener Daten und die Gewährleistung digitaler Rechte informieren wir Sie, dass die hier bereitgestellten personenbezogenen Daten in eine Datei aufgenommen werden, die Eigentum von und in der Verantwortung von Hotel Venecia de Valencia, S.L.U liegt.',
    ],
    sections: [
      {
        h: 'Wer ist für Ihre Daten verantwortlich?',
        p: [
          'Verantwortlicher: Hotel Venecia de Valencia, S.L.U.',
          'Steuernummer (CIF): B97052534',
          'Sitz: Pza. Ayuntamiento, 3, 46002 Valencia.',
          'Kontakttelefon: +34 963 52 42 67',
          'E-Mail: reservas@hotelvenecia.com',
          'Website: https://hotelvenecia.com',
          'Bitte beachten Sie, dass diese Datenschutzerklärung die Privatsphäre, Informationen oder sonstigen Praktiken Dritter nicht abdeckt und wir dafür nicht verantwortlich sind, einschließlich der Betreiber von Websites, auf die unsere Portale verlinken. Die Aufnahme eines Links in die Portale bedeutet keine Billigung der verlinkten Website durch uns oder unsere verbundenen Unternehmen.',
        ],
      },
      {
        h: 'Rechtmäßigkeit der Datenverarbeitung',
        p: [
          'Wir respektieren Ihre Privatsphäre. Deshalb verarbeiten wir Ihre personenbezogenen Daten nur, wenn wir dazu berechtigt sind. Sie können uns Ihre Einwilligung zur Verarbeitung Ihrer personenbezogenen Daten erteilen, wenn die Verarbeitung dies erfordert. In anderen Fällen, wenn Sie Dienste unserer Website nutzen, die Ihre Daten zur Durchführung erfordern, sind wir berechtigt, Ihre Daten zur Ausführung dieser Tätigkeit zu verarbeiten. Ein Beispiel dafür ist das Zugriffsprotokoll, das wir führen, um beispielsweise sicherzustellen, dass unsere Website fehlerfrei funktioniert (einschließlich ihrer technischen Wartung). In jedem Fall informieren wir Sie über die durchgeführte Verarbeitung personenbezogener Daten, und selbstverständlich werden Ihre Rechte und Interessen stets berücksichtigt. Bei Fragen zu Ihren personenbezogenen Daten finden Sie Ihre Datenschutzrechte weiter unten auf dieser Seite.',
        ],
      },
      {
        h: 'Zweck der Datenverarbeitung',
        p: [
          'Wir machen personenbezogene Informationen ohne Zustimmung nicht öffentlich. Wir verkaufen oder teilen personenbezogene Informationen nicht freiwillig.',
          'Hotel Venecia de Valencia, S.L.U wird Ihre Daten als Nutzer manuell und/oder automatisiert für folgende spezifische Zwecke verarbeiten:',
          '• Verwaltung und Bestätigung Ihrer Buchung, Abwicklung Ihrer Zahlung, Zusendung der Buchungsbestätigung per E-Mail, Kontaktaufnahme mit Ihnen bei Bedarf und Beantwortung Ihrer Anfragen.',
          '• Erstellung anonymer statistischer Berichte über Zugriffsgewohnheiten und die Aktivität der Nutzer auf der Website.',
          '• Durchführung der erforderlichen Maßnahmen zum Schutz der Interessen der Kunden, wenn nötig, oder zur Erfüllung von Gerichtsentscheidungen und den darin vereinbarten Maßnahmen.',
          '• Versand elektronischer Mitteilungen mit Angeboten, Aktionen und Neuigkeiten im Zusammenhang mit unserer Tätigkeit, nur wenn Sie als Kunde dem zugestimmt oder nicht ausdrücklich widersprochen haben.',
          'Bei einer Buchung erfassen wir Ihren Vor- und Nachnamen, E-Mail, Telefonnummer, Land (optional), Sprache, die gewählte Zimmer und das Datum, die Anzahl der Gäste sowie etwaige von Ihnen angegebene Hinweise.',
          'Wenn Sie sich entscheiden, uns außerhalb einer vertraglichen Beziehung oder ohne Registrierung zu kontaktieren, können Sie dies über die Website oder die Kontakt-E-Mail tun.',
          'Um Ihre Anfrage bei Kontaktaufnahme ordnungsgemäß bearbeiten zu können, bitten wir Sie möglicherweise um personenbezogene Daten wie Ihren Namen, Ihre E-Mail und weitere Informationen zu Ihrer Anfrage und Nachricht. Optional können Sie Ihre Postanschrift und/oder Telefonnummer angeben. Wir erheben die angeforderten Informationen ausschließlich zum Zweck der ordnungsgemäßen Bearbeitung Ihrer Anfrage. Die Daten werden nicht für weitere Zwecke verwendet oder ohne Ihre ausdrückliche Zustimmung an Dritte weitergegeben, es sei denn, wir sind gesetzlich dazu berechtigt. Ist die Aufbewahrung Ihrer personenbezogenen Daten gesetzlich nicht vorgeschrieben, werden diese nach Bearbeitung Ihrer Anfrage gelöscht.',
          'Falls Sie uns Ihren Lebenslauf zusenden, verarbeiten wir Ihre Daten, um Ihre Bewerbung zu prüfen und zu verwalten und gegebenenfalls die erforderlichen Maßnahmen zur Personalauswahl und -einstellung durchzuführen, um Ihnen zu Ihrem Profil passende Stellen anzubieten.',
          'Aus technischen Gründen werden bei jedem Zugriff Ihres Browsers auf unsere Website automatisch Informationen an unseren Server gesendet (z. B. Navigationsdaten). Ein Teil dieser Informationen wird in Protokolldateien gespeichert, wie zum Beispiel:',
          '• Zugriffsdatum',
          '• Zugriffszeit',
          '• URL der Seite',
          '• HTTP-Protokollversion',
          '• aufgerufene Dateien',
          '• übertragenes Datenvolumen',
          '• Art des Internetbrowsers und dessen Version',
          '• Art des Betriebssystems',
          '• IP-Adresse (anonymisiert)',
          'Die Navigationsdaten enthalten keine personenbezogenen Daten. Wir analysieren Navigationsdaten nur, wenn nötig, insbesondere um Störungen im Betrieb unserer Website zu beheben oder Sicherheitsvorfälle zu lösen. Wir speichern diese Daten unbefristet.',
        ],
      },
      {
        h: 'Empfänger der Datenweitergabe',
        p: [
          'Wir geben die von uns erhobenen personenbezogenen Daten nur an Auftragsverarbeiter weiter, die mit unserem Unternehmen einen Auftragsverarbeitungsvertrag über personenbezogene Daten geschlossen haben und sich zur angemessenen Verarbeitung unserer Aufzeichnungen verpflichten.',
          'Zur Erbringung des Buchungsdienstes dieser Website arbeitet Hotel Venecia de Valencia, S.L.U mit folgenden Auftragsverarbeitern zusammen:',
          '• Airtable: speichert die Buchungsdaten (Vor- und Nachname, E-Mail, Telefon, Daten und Zimmer).',
          '• Vercel: hostet die Website und führt ihre Funktionen aus.',
          '• Resend: sendet die Buchungsbestätigung per E-Mail an den Kunden und die Buchungsmitteilung an das Hotel.',
          '• Redsys und Caixa Popular (Bank des Hotels): wickeln die Zahlung per Karte oder anderen Zahlungsmitteln ab. Ihre Kartendaten werden direkt über das Zahlungsgateway von Redsys eingegeben: Hotel Venecia de Valencia, S.L.U erhält oder speichert diese nicht; es erhält lediglich die Bestätigung, dass die Zahlung erfolgt ist, und deren Betrag.',
          'Einige dieser Anbieter können Daten außerhalb des Europäischen Wirtschaftsraums verarbeiten; in diesem Fall gelten die in der Verordnung (EU) 2016/679 vorgesehenen Garantien für internationale Datenübermittlungen.',
          'Wir können außerdem verpflichtet sein, personenbezogene Daten weiterzugeben, wenn dies zur Erbringung der Dienstleistung oder zur Beantwortung der gestellten Anfrage erforderlich ist, sowie in den gesetzlich vorgesehenen Fällen.',
        ],
      },
      {
        h: 'Aufbewahrungsfrist der personenbezogenen Daten',
        p: [
          'Hotel Venecia de Valencia, S.L.U wird Ihre personenbezogenen Daten als Nutzer nur so lange aufbewahren, wie es für die Erfüllung der Zwecke erforderlich ist, für die sie erhoben wurden, solange Sie die erteilten Einwilligungen nicht widerrufen. Danach wird es die Informationen, falls erforderlich, für die gesetzlich festgelegten Fristen gesperrt aufbewahren, in jedem Fall für 5 Jahre, oder die gesetzlich vorgesehene Frist für etwaige aus der Verarbeitung entstehende Ansprüche.',
          'Im Falle der Daten, die Sie uns mit der Zusendung Ihres Lebenslaufs für ein Personalauswahlverfahren zur Verfügung stellen, werden diese 3 Jahre ab dem Datum der letzten Aktualisierung aufbewahrt. Nach Ablauf dieser Frist werden die Daten, sofern sie nicht aktualisiert wurden, gelöscht, sofern Sie uns nichts anderes mitteilen.',
        ],
      },
      {
        h: 'Rechte der Nutzer',
        p: [
          'Sie können uns schriftlich an Hotel Venecia de Valencia, S.L.U, Pza. Ayuntamiento, 3, 46002 Valencia, oder per E-Mail an reservas@hotelvenecia.com kontaktieren, um eine der folgenden Handlungen vorzunehmen:',
          '• Die erteilten Einwilligungen widerrufen.',
          '• Bestätigung darüber erhalten, ob Hotel Venecia de Valencia, S.L.U Sie betreffende personenbezogene Daten verarbeitet oder nicht.',
          '• Auf Ihre personenbezogenen Daten zugreifen.',
          '• Unrichtige oder unvollständige Daten berichtigen.',
          '• Die Löschung Ihrer Daten beantragen, wenn diese unter anderem für die Zwecke, für die sie erhoben wurden, nicht mehr erforderlich sind.',
          '• Von Hotel Venecia de Valencia, S.L.U die Einschränkung der Datenverarbeitung erwirken, wenn eine der in den Datenschutzvorschriften vorgesehenen Bedingungen erfüllt ist.',
          '• Unter bestimmten Umständen und aus Gründen, die mit ihrer besonderen Situation zusammenhängen, können betroffene Personen der Verarbeitung ihrer Daten widersprechen. Hotel Venecia de Valencia, S.L.U wird die Verarbeitung der Daten einstellen, außer aus zwingenden berechtigten Gründen oder zur Ausübung oder Verteidigung etwaiger Ansprüche.',
          '• Menschliches Eingreifen erwirken, Ihren Standpunkt äußern und automatisierte Entscheidungen anfechten.',
          '• Die Übertragbarkeit Ihrer Daten beantragen.',
          '• Bei der spanischen Datenschutzbehörde (https://www.agpd.es) Beschwerde einlegen, wenn Sie der Ansicht sind, dass Hotel Venecia de Valencia, S.L.U die Ihnen durch die anwendbaren Datenschutzvorschriften zuerkannten Rechte verletzt hat.',
        ],
      },
    ],
    contact: 'Fragen zu Ihren Daten? Schreiben Sie uns:',
  },

  legalnotice: {
    intro: [
      'Inhaber dieser Website ist Hotel Venecia de Valencia, S.L.U. Der Sitz von Hotel Venecia de Valencia, S.L.U ist Pza. Ayuntamiento, 3, 46002 Valencia, Telefon +34 963 52 42 67. Die Kontakt-E-Mail von Hotel Venecia de Valencia, S.L.U lautet reservas@hotelvenecia.com.',
    ],
    sections: [
      {
        h: 'Angaben zum Inhaber',
        p: [
          'Inhaber: Hotel Venecia de Valencia, S.L.U.',
          'Steuernummer (CIF): B97052534',
          'Sitz: Pza. Ayuntamiento, 3, 46002 Valencia.',
        ],
      },
      {
        h: 'Nutzungsbedingungen',
        p: [
          'Durch die Nutzung der Inhalte und/oder Dienste dieser Website verpflichten Sie sich zur Einhaltung der folgenden Nutzungsbedingungen:',
          'Hotel Venecia de Valencia, S.L.U behält sich das Recht vor, Inhalt, Konfiguration und Darstellung dieser Website ohne vorherige Ankündigung zu ändern. Diese Website kann Links zu anderen externen Websites enthalten; in diesem Fall übernimmt Hotel Venecia de Valencia, S.L.U keine Verantwortung für den Inhalt und die Konfiguration dieser Websites.',
        ],
      },
      {
        h: 'Geistiges Eigentum',
        p: [
          'Die Texte, Bilder, Logos und sonstigen Inhalte dieser Website sind Eigentum von Hotel Venecia de Valencia, S.L.U. Sofern nicht anders angegeben, dürfen die Inhalte dieser Seite ohne Zustimmung von Hotel Venecia de Valencia, S.L.U nicht übermittelt, verbreitet, vervielfältigt oder gespeichert werden.',
        ],
      },
      {
        h: 'Haftungsausschluss',
        p: [
          'Hotel Venecia de Valencia, S.L.U übernimmt keine Verantwortung für etwaige Schäden, die durch die Verwendung veralteter Browserversionen entstehen können, noch für die Folgen einer Fehlfunktion der Browser aufgrund unsachgemäßer Konfiguration, des Vorhandenseins von Computerviren oder anderer Ursachen.',
        ],
      },
      {
        h: 'Anwendbares Recht',
        p: [
          'Dieses Impressum unterliegt spanischem Recht. Für jegliche Streitigkeiten im Zusammenhang mit der Nutzung dieser Website sind die spanischen Gerichte zuständig.',
        ],
      },
    ],
    contact: 'Haben Sie Fragen? Schreiben Sie uns:',
  },
};

const TEXTS: Partial<Record<Locale, Record<LegalPageId, LegalText>>> = { es: ES, en: EN, it: IT, fr: FR, de: DE };

export function isLegalTextPage(id: string): id is LegalPageId {
  return id === 'privacy' || id === 'legalnotice';
}

/** Texto en el idioma pedido. */
export function legalText(lang: Locale, id: LegalPageId): LegalText {
  return (TEXTS[lang] ?? ES)[id];
}
