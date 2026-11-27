#!/usr/bin/env python3
"""Genera las versiones en inglés, italiano, francés y alemán de la web de eventos.

La página en español (eventos-web/index.html) es la única que se edita a mano.
Después de cambiarla:      python3 scripts/eventos-idiomas.py
Escribe eventos-web/{en,it,fr,de}/index.html.

Cada entrada de TEXTOS es (fragmento exacto en español, en, it, fr, de). Si un
fragmento ya no está en la página española, el script se para y lo dice: hay que
actualizar aquí el texto y sus traducciones.

En las traducciones se usa el apóstrofo tipográfico (’), nunca el recto: muchos
textos van dentro de cadenas de JavaScript con comillas simples.
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent / 'eventos-web'
IDIOMAS = ['en', 'it', 'fr', 'de']
FALLAS = 'https://fallas.hotelvenecia.com'

TEXTOS = [
    # ── cabecera del documento ──
    ('<html lang="es">', '<html lang="en">', '<html lang="it">', '<html lang="fr">', '<html lang="de">'),
    ('<title>Eventos · Hotel Venecia Plaza Centro</title>',
     '<title>Events · Hotel Venecia Plaza Centro</title>',
     '<title>Eventi · Hotel Venecia Plaza Centro</title>',
     '<title>Événements · Hotel Venecia Plaza Centro</title>',
     '<title>Events · Hotel Venecia Plaza Centro</title>'),

    # ── barra y menú ──
    ('aria-label="Ir arriba"', 'aria-label="Back to top"', 'aria-label="Torna su"', 'aria-label="Haut de page"', 'aria-label="Nach oben"'),
    ('<small>Eventos</small>', '<small>Events</small>', '<small>Eventi</small>', '<small>Événements</small>', '<small>Events</small>'),
    ('<div class="links"><a href="#fallas">Fallas 2027</a><a href="#proximos">Próximos eventos</a><a href="#tu-evento">Tu evento</a><a href="#contacto">Contacto</a></div>',
     '<div class="links"><a href="#fallas">Fallas 2027</a><a href="#proximos">Upcoming events</a><a href="#tu-evento">Your event</a><a href="#contacto">Contact</a></div>',
     '<div class="links"><a href="#fallas">Fallas 2027</a><a href="#proximos">Prossimi eventi</a><a href="#tu-evento">Il suo evento</a><a href="#contacto">Contatto</a></div>',
     '<div class="links"><a href="#fallas">Fallas 2027</a><a href="#proximos">Prochains événements</a><a href="#tu-evento">Votre événement</a><a href="#contacto">Contact</a></div>',
     '<div class="links"><a href="#fallas">Fallas 2027</a><a href="#proximos">Nächste Events</a><a href="#tu-evento">Ihr Event</a><a href="#contacto">Kontakt</a></div>'),
    ('aria-label="Idioma"', 'aria-label="Language"', 'aria-label="Lingua"', 'aria-label="Langue"', 'aria-label="Sprache"'),
    ('<a class="btn" href="#contacto">Consultar</a><button class="burger"',
     '<a class="btn" href="#contacto">Enquire</a><button class="burger"',
     '<a class="btn" href="#contacto">Contatto</a><button class="burger"',
     '<a class="btn" href="#contacto">Contact</a><button class="burger"',
     '<a class="btn" href="#contacto">Anfragen</a><button class="burger"'),
    ('aria-label="Abrir menú"', 'aria-label="Open menu"', 'aria-label="Apri il menu"', 'aria-label="Ouvrir le menu"', 'aria-label="Menü öffnen"'),
    ('aria-label="Menú principal"', 'aria-label="Main menu"', 'aria-label="Menu principale"', 'aria-label="Menu principal"', 'aria-label="Hauptmenü"'),
    ('    <a href="#proximos">Próximos eventos</a>\n    <a href="#tu-evento">Tu evento</a>\n    <a href="#contacto">Contacto</a>\n',
     '    <a href="#proximos">Upcoming events</a>\n    <a href="#tu-evento">Your event</a>\n    <a href="#contacto">Contact</a>\n',
     '    <a href="#proximos">Prossimi eventi</a>\n    <a href="#tu-evento">Il suo evento</a>\n    <a href="#contacto">Contatto</a>\n',
     '    <a href="#proximos">Prochains événements</a>\n    <a href="#tu-evento">Votre événement</a>\n    <a href="#contacto">Contact</a>\n',
     '    <a href="#proximos">Nächste Events</a>\n    <a href="#tu-evento">Ihr Event</a>\n    <a href="#contacto">Kontakt</a>\n'),
    ('>Web del hotel</a>', '>Hotel website</a>', '>Sito dell’hotel</a>', '>Site de l’hôtel</a>', '>Website des Hotels</a>'),

    # ── portada ──
    ('<h1>Organiza tu <em>evento</em> en el centro de Valencia</h1>',
     '<h1>Host your <em>event</em> in the heart of Valencia</h1>',
     '<h1>Organizzi il suo <em>evento</em> nel centro di Valencia</h1>',
     '<h1>Organisez votre <em>événement</em> au cœur de Valence</h1>',
     '<h1>Ihr <em>Event</em> im Herzen von Valencia</h1>'),
    ('Balcones en primera línea de mascletà y espacios privados para celebraciones, reuniones y eventos exclusivos en plena Plaza del Ayuntamiento.',
     'Front-row balconies for the mascletà and private spaces for celebrations, meetings and exclusive events right on Plaza del Ayuntamiento.',
     'Balconi in prima fila per la mascletà e spazi privati per feste, riunioni ed eventi esclusivi in piena Plaza del Ayuntamiento.',
     'Des balcons aux premières loges de la mascletà et des espaces privés pour vos fêtes, réunions et événements exclusifs, en plein cœur de la Plaza del Ayuntamiento.',
     'Balkone in erster Reihe zur Mascletà und private Räume für Feiern, Treffen und exklusive Events direkt an der Plaza del Ayuntamiento.'),
    ('>Ver próximos eventos</a>', '>See upcoming events</a>', '>Vedi i prossimi eventi</a>', '>Voir les prochains événements</a>', '>Nächste Events ansehen</a>'),
    ('>Descúbrelo ↓</a>', '>Discover ↓</a>', '>Scopra di più ↓</a>', '>Découvrir ↓</a>', '>Mehr entdecken ↓</a>'),
    ('<span>Ubicación única</span>', '<span>A unique location</span>', '<span>Posizione unica</span>', '<span>Emplacement unique</span>', '<span>Einzigartige Lage</span>'),
    ('<strong>Salones privados</strong><span>Con vistas a la plaza</span>',
     '<strong>Private rooms</strong><span>Overlooking the square</span>',
     '<strong>Sale private</strong><span>Con vista sulla piazza</span>',
     '<strong>Salons privés</strong><span>Avec vue sur la place</span>',
     '<strong>Private Räume</strong><span>Mit Blick auf den Platz</span>'),
    ('<strong>Eventos a tu medida</strong><span>Todo el año</span>',
     '<strong>Tailor-made events</strong><span>All year round</span>',
     '<strong>Eventi su misura</strong><span>Tutto l’anno</span>',
     '<strong>Événements sur mesure</strong><span>Toute l’année</span>',
     '<strong>Events nach Maß</strong><span>Das ganze Jahr</span>'),
    ('<strong>Hasta 20 personas</strong><span>Aforo máximo</span>',
     '<strong>Up to 20 people</strong><span>Maximum capacity</span>',
     '<strong>Fino a 20 persone</strong><span>Capienza massima</span>',
     '<strong>Jusqu’à 20 personnes</strong><span>Capacité maximale</span>',
     '<strong>Bis zu 20 Personen</strong><span>Maximale Kapazität</span>'),

    # ── Fallas ──
    ('<span class="open-note">Ventas abiertas</span>', '<span class="open-note">Booking now open</span>', '<span class="open-note">Vendite aperte</span>', '<span class="open-note">Réservations ouvertes</span>', '<span class="open-note">Jetzt buchbar</span>'),
    ('<h2>La mascletà, <em>en primera línea</em></h2>', '<h2>The mascletà, <em>from the front row</em></h2>', '<h2>La mascletà, <em>in prima fila</em></h2>', '<h2>La mascletà, <em>aux premières loges</em></h2>', '<h2>Die Mascletà <em>aus erster Reihe</em></h2>'),
    ('/balcones/">Balcones</a>', '/en/balconies/">Balconies</a>', '/it/balconi/">Balconi</a>', '/fr/balcons/">Balcons</a>', '/de/balkone/">Balkone</a>'),
    ('/espacios/">Espacios</a>', '/en/spaces/">Spaces</a>', '/it/spazi/">Spazi</a>', '/fr/espaces/">Espaces</a>', '/de/raeume/">Räume</a>'),

    # tarjetas ocultas (se traducen también por si vuelven a mostrarse)
    ('>Reservas abiertas</span>', '>Booking open</span>', '>Prenotazioni aperte</span>', '>Réservations ouvertes</span>', '>Jetzt buchbar</span>'),
    ('<h3>Balcón <em>privado</em></h3>', '<h3>Private <em>balcony</em></h3>', '<h3>Balcone <em>privato</em></h3>', '<h3>Balcon <em>privé</em></h3>', '<h3>Privater <em>Balkon</em></h3>'),
    ('<p>Tu propio balcón sobre la plaza para ver cada mascletà de las Fallas, con todo incluido.</p>',
     '<p>Your own balcony over the square to watch every Fallas mascletà, all inclusive.</p>',
     '<p>Il suo balcone sulla piazza per vedere ogni mascletà delle Fallas, tutto incluso.</p>',
     '<p>Votre propre balcon sur la place pour voir chaque mascletà des Fallas, tout compris.</p>',
     '<p>Ihr eigener Balkon über dem Platz für jede Mascletà der Fallas, alles inklusive.</p>'),
    ('<span class="pill">Del 1 al 19 de marzo</span><span class="pill">Vistas a la plaza</span><span class="pill">Pago online</span>',
     '<span class="pill">1–19 March</span><span class="pill">Square views</span><span class="pill">Online payment</span>',
     '<span class="pill">Dall’1 al 19 marzo</span><span class="pill">Vista sulla piazza</span><span class="pill">Pagamento online</span>',
     '<span class="pill">Du 1er au 19 mars</span><span class="pill">Vue sur la place</span><span class="pill">Paiement en ligne</span>',
     '<span class="pill">1.–19. März</span><span class="pill">Blick auf den Platz</span><span class="pill">Online-Zahlung</span>'),
    ('desde<b>95 €</b>por persona<small>¡quedan pocos!</small></span><a class="btn" href="#">Reservar balcón</a>',
     'from<b>95 €</b>per person<small>only a few left!</small></span><a class="btn" href="#">Book a balcony</a>',
     'da<b>95 €</b>a persona<small>ne restano pochi!</small></span><a class="btn" href="#">Prenota il balcone</a>',
     'dès<b>95 €</b>par personne<small>plus que quelques-uns !</small></span><a class="btn" href="#">Réserver un balcon</a>',
     'ab<b>95 €</b>pro Person<small>nur noch wenige!</small></span><a class="btn" href="#">Balkon buchen</a>'),
    ('>Reservas · pronto</span>', '>Booking soon</span>', '>Prenotazioni a breve</span>', '>Bientôt</span>', '>Bald buchbar</span>'),
    ('<h3>Espacio <em>exclusivo</em></h3>', '<h3>Exclusive <em>space</em></h3>', '<h3>Spazio <em>esclusivo</em></h3>', '<h3>Espace <em>exclusif</em></h3>', '<h3>Exklusiver <em>Raum</em></h3>'),
    ('<p>Un salón entero del hotel, solo para ti y tus invitados, para ver la mascletà con total privacidad.</p>',
     '<p>A whole hotel room just for you and your guests, to watch the mascletà in complete privacy.</p>',
     '<p>Un’intera sala dell’hotel, solo per lei e i suoi ospiti, per vedere la mascletà in totale privacy.</p>',
     '<p>Un salon entier de l’hôtel, rien que pour vous et vos invités, pour voir la mascletà en toute intimité.</p>',
     '<p>Ein ganzer Raum des Hotels nur für Sie und Ihre Gäste, um die Mascletà ganz privat zu erleben.</p>'),
    ('<span class="pill">Hasta 20 personas</span><span class="pill">7 espacios</span><span class="pill">IVA incluido</span>',
     '<span class="pill">Up to 20 people</span><span class="pill">7 spaces</span><span class="pill">VAT included</span>',
     '<span class="pill">Fino a 20 persone</span><span class="pill">7 spazi</span><span class="pill">IVA inclusa</span>',
     '<span class="pill">Jusqu’à 20 personnes</span><span class="pill">7 espaces</span><span class="pill">TVA incluse</span>',
     '<span class="pill">Bis zu 20 Personen</span><span class="pill">7 Räume</span><span class="pill">inkl. MwSt.</span>'),
    ('desde<b>480 €</b>al día<small>espacio entero</small></span><a class="btn btn-ghost" href="#">Ver espacios</a>',
     'from<b>480 €</b>per day<small>whole space</small></span><a class="btn btn-ghost" href="#">See spaces</a>',
     'da<b>480 €</b>al giorno<small>spazio intero</small></span><a class="btn btn-ghost" href="#">Vedi gli spazi</a>',
     'dès<b>480 €</b>par jour<small>espace entier</small></span><a class="btn btn-ghost" href="#">Voir les espaces</a>',
     'ab<b>480 €</b>pro Tag<small>ganzer Raum</small></span><a class="btn btn-ghost" href="#">Räume ansehen</a>'),

    # ── galería ──
    ('aria-label="Vistas desde el hotel"', 'aria-label="Views from the hotel"', 'aria-label="Viste dall’hotel"', 'aria-label="Vues depuis l’hôtel"', 'aria-label="Ausblicke vom Hotel"'),

    # ── próximos eventos ──
    ('<h2>Próximos <em>eventos</em></h2>', '<h2>Upcoming <em>events</em></h2>', '<h2>Prossimi <em>eventi</em></h2>', '<h2>Prochains <em>événements</em></h2>', '<h2>Nächste <em>Events</em></h2>'),
    ('<p>Reuniones, celebraciones y experiencias especiales.</p>', '<p>Meetings, celebrations and special experiences.</p>', '<p>Riunioni, feste ed esperienze speciali.</p>', '<p>Réunions, fêtes et expériences d’exception.</p>', '<p>Treffen, Feiern und besondere Erlebnisse.</p>'),
    ('data-f="all">Todos</button>', 'data-f="all">All</button>', 'data-f="all">Tutti</button>', 'data-f="all">Tous</button>', 'data-f="all">Alle</button>'),
    ('data-f="bienestar">Bienestar</button>', 'data-f="bienestar">Wellness</button>', 'data-f="bienestar">Benessere</button>', 'data-f="bienestar">Bien-être</button>', 'data-f="bienestar">Wellness</button>'),
    ('data-f="celebraciones">Celebraciones</button>', 'data-f="celebraciones">Celebrations</button>', 'data-f="celebraciones">Feste</button>', 'data-f="celebraciones">Fêtes</button>', 'data-f="celebraciones">Feiern</button>'),
    ('data-f="cultura">Cultura y gastronomía</button>', 'data-f="cultura">Culture and food</button>', 'data-f="cultura">Cultura e gastronomia</button>', 'data-f="cultura">Culture et gastronomie</button>', 'data-f="cultura">Kultur und Kulinarik</button>'),
    ('<span class="tag">Bienestar</span>', '<span class="tag">Wellness</span>', '<span class="tag">Benessere</span>', '<span class="tag">Bien-être</span>', '<span class="tag">Wellness</span>'),
    ('<span class="tag">Celebraciones</span>', '<span class="tag">Celebrations</span>', '<span class="tag">Feste</span>', '<span class="tag">Fêtes</span>', '<span class="tag">Feiern</span>'),
    ('<span>Dic</span>', '<span>Dec</span>', '<span>Dic</span>', '<span>Déc</span>', '<span>Dez</span>'),
    ('<h3>Pilates &amp; coronas navideñas</h3><p>Disfruta de una sesión de pilates de la mano de Bloomfit y crea tu propia corona de flores navideña.</p>',
     '<h3>Pilates &amp; Christmas wreaths</h3><p>Enjoy a pilates session with Bloomfit and make your own Christmas flower wreath.</p>',
     '<h3>Pilates e corone di Natale</h3><p>Si goda una lezione di pilates con Bloomfit e crei la sua corona natalizia di fiori.</p>',
     '<h3>Pilates &amp; couronnes de Noël</h3><p>Profitez d’une séance de pilates avec Bloomfit et créez votre propre couronne de fleurs de Noël.</p>',
     '<h3>Pilates &amp; Weihnachtskränze</h3><p>Genießen Sie eine Pilates-Stunde mit Bloomfit und gestalten Sie Ihren eigenen Weihnachtskranz aus Blumen.</p>'),
    ('<span class="pill">7 dic · 17–20 h</span><span class="pill">8 dic · 10–13 h y 17–20 h</span>',
     '<span class="pill">7 Dec · 17:00–20:00</span><span class="pill">8 Dec · 10:00–13:00 and 17:00–20:00</span>',
     '<span class="pill">7 dic · 17–20</span><span class="pill">8 dic · 10–13 e 17–20</span>',
     '<span class="pill">7 déc. · 17 h–20 h</span><span class="pill">8 déc. · 10 h–13 h et 17 h–20 h</span>',
     '<span class="pill">7. Dez. · 17–20 Uhr</span><span class="pill">8. Dez. · 10–13 und 17–20 Uhr</span>'),
    ('<b>55 €</b>por persona</span><a class="btn" href="#contacto">Reservar</a>',
     '<b>55 €</b>per person</span><a class="btn" href="#contacto">Book</a>',
     '<b>55 €</b>a persona</span><a class="btn" href="#contacto">Prenota</a>',
     '<b>55 €</b>par personne</span><a class="btn" href="#contacto">Réserver</a>',
     '<b>55 €</b>pro Person</span><a class="btn" href="#contacto">Buchen</a>'),
    ('<p>Una sesión de pilates con sorpresas de bienvenida y un delicioso postentreno con brunch y bebidas de la mano de Brutal Valencia.</p>',
     '<p>A pilates session with welcome surprises and a delicious post-workout brunch with drinks by Brutal Valencia.</p>',
     '<p>Una lezione di pilates con sorprese di benvenuto e un delizioso brunch post-allenamento con bevande di Brutal Valencia.</p>',
     '<p>Une séance de pilates avec des surprises de bienvenue et un délicieux brunch après l’effort, boissons comprises, par Brutal Valencia.</p>',
     '<p>Eine Pilates-Stunde mit Willkommensüberraschungen und danach ein köstlicher Brunch mit Getränken von Brutal Valencia.</p>'),
    ('<span class="pill">11:00 h</span><span class="pill">17:00 h (English Class)</span><span class="pill">19:00 h</span>',
     '<span class="pill">11:00</span><span class="pill">17:00 (English class)</span><span class="pill">19:00</span>',
     '<span class="pill">11:00</span><span class="pill">17:00 (lezione in inglese)</span><span class="pill">19:00</span>',
     '<span class="pill">11 h</span><span class="pill">17 h (cours en anglais)</span><span class="pill">19 h</span>',
     '<span class="pill">11:00 Uhr</span><span class="pill">17:00 Uhr (auf Englisch)</span><span class="pill">19:00 Uhr</span>'),
    ('pointer-events:none">Sold out</span>', 'pointer-events:none">Sold out</span>', 'pointer-events:none">Esaurito</span>', 'pointer-events:none">Complet</span>', 'pointer-events:none">Ausgebucht</span>'),
    ('<h3>Organiza tu evento con nosotros</h3><p>Tú pones la idea y nosotros el escenario: un espacio con luz, vistas a la Plaza del Ayuntamiento y todo lo necesario para que tu celebración sea inolvidable.</p>',
     '<h3>Host your event with us</h3><p>You bring the idea, we set the stage: a bright space with views of Plaza del Ayuntamiento and everything you need for an unforgettable celebration.</p>',
     '<h3>Organizzi il suo evento con noi</h3><p>Lei porta l’idea, noi la scena: uno spazio luminoso con vista sulla Plaza del Ayuntamiento e tutto il necessario per una festa indimenticabile.</p>',
     '<h3>Organisez votre événement avec nous</h3><p>Vous apportez l’idée, nous le décor : un espace lumineux avec vue sur la Plaza del Ayuntamiento et tout le nécessaire pour une fête inoubliable.</p>',
     '<h3>Feiern Sie Ihr Event bei uns</h3><p>Sie bringen die Idee, wir die Bühne: ein heller Raum mit Blick auf die Plaza del Ayuntamiento und alles, was Ihre Feier unvergesslich macht.</p>'),
    ('<a class="btn btn-ghost" href="#contacto">Consultar</a>',
     '<a class="btn btn-ghost" href="#contacto">Enquire</a>',
     '<a class="btn btn-ghost" href="#contacto">Richiedi informazioni</a>',
     '<a class="btn btn-ghost" href="#contacto">Nous consulter</a>',
     '<a class="btn btn-ghost" href="#contacto">Anfragen</a>'),

    # ── tu propio evento ──
    ('<span class="eyebrow">Eventos privados</span>', '<span class="eyebrow">Private events</span>', '<span class="eyebrow">Eventi privati</span>', '<span class="eyebrow">Événements privés</span>', '<span class="eyebrow">Private Events</span>'),
    ('Organiza <em>tu propio evento</em> con nosotros</h2>', 'Host <em>your own event</em> with us</h2>', 'Organizzi <em>il suo evento</em> con noi</h2>', 'Organisez <em>votre propre événement</em> avec nous</h2>', 'Planen Sie <em>Ihr eigenes Event</em> mit uns</h2>'),
    ('<p>Espacios con carácter, en un edificio señorial de la Plaza del Ayuntamiento. Te ayudamos a diseñar el evento a tu medida.</p>',
     '<p>Spaces with character in a stately building on Plaza del Ayuntamiento. We help you design an event made to measure.</p>',
     '<p>Spazi di carattere in un edificio signorile della Plaza del Ayuntamiento. La aiutiamo a progettare un evento su misura.</p>',
     '<p>Des espaces de caractère dans un bel immeuble de la Plaza del Ayuntamiento. Nous vous aidons à créer un événement sur mesure.</p>',
     '<p>Räume mit Charakter in einem herrschaftlichen Gebäude an der Plaza del Ayuntamiento. Wir helfen Ihnen, Ihr Event nach Maß zu gestalten.</p>'),
    ('<li>Espacios de 10 a 40 m² con luz natural y vistas</li>', '<li>Spaces from 10 to 40 m² with natural light and views</li>', '<li>Spazi da 10 a 40 m² con luce naturale e vista</li>', '<li>Espaces de 10 à 40 m² avec lumière naturelle et vue</li>', '<li>Räume von 10 bis 40 m² mit Tageslicht und Aussicht</li>'),
    ('<li>Alojamiento en el mismo hotel para tus invitados</li>', '<li>Accommodation for your guests at the same hotel</li>', '<li>Alloggio per i suoi ospiti nello stesso hotel</li>', '<li>Hébergement de vos invités dans le même hôtel</li>', '<li>Übernachtung für Ihre Gäste im selben Hotel</li>'),
    ('<li>Propuesta personalizada en menos de 48 horas</li>', '<li>A personalised proposal in under 48 hours</li>', '<li>Proposta personalizzata in meno di 48 ore</li>', '<li>Proposition personnalisée en moins de 48 heures</li>', '<li>Persönliches Angebot in weniger als 48 Stunden</li>'),
    ('>desde <span style="color:var(--navy)">100 €</span> al día</span>',
     '>from <span style="color:var(--navy)">100 €</span> a day</span>',
     '>da <span style="color:var(--navy)">100 €</span> al giorno</span>',
     '>à partir de <span style="color:var(--navy)">100 €</span> par jour</span>',
     '>ab <span style="color:var(--navy)">100 €</span> pro Tag</span>'),
    ('>Solicitar presupuesto</a>', '>Request a quote</a>', '>Richiedi un preventivo</a>', '>Demander un devis</a>', '>Angebot anfordern</a>'),

    # ── cómo funciona ──
    ('<h2>Cómo <em>funciona</em></h2>', '<h2>How it <em>works</em></h2>', '<h2>Come <em>funziona</em></h2>', '<h2>Comment ça <em>marche</em></h2>', '<h2>So <em>funktioniert’s</em></h2>'),
    ('<h3>Elige tu evento</h3><p>Explora las Fallas, los próximos eventos o cuéntanos tu idea.</p>',
     '<h3>Choose your event</h3><p>Explore Fallas and the upcoming events, or tell us your idea.</p>',
     '<h3>Scelga il suo evento</h3><p>Esplori le Fallas e i prossimi eventi, o ci racconti la sua idea.</p>',
     '<h3>Choisissez votre événement</h3><p>Découvrez les Fallas, les prochains événements ou parlez-nous de votre idée.</p>',
     '<h3>Event wählen</h3><p>Entdecken Sie die Fallas und die nächsten Events oder erzählen Sie uns Ihre Idee.</p>'),
    ('<h3>Reserva o consulta</h3><p>Paga online en los eventos con reserva directa o escríbenos para los demás.</p>',
     '<h3>Book or enquire</h3><p>Pay online for events with direct booking, or write to us about the others.</p>',
     '<h3>Prenoti o chieda</h3><p>Paghi online per gli eventi con prenotazione diretta, o ci scriva per gli altri.</p>',
     '<h3>Réservez ou consultez-nous</h3><p>Payez en ligne les événements à réservation directe ou écrivez-nous pour les autres.</p>',
     '<h3>Buchen oder anfragen</h3><p>Zahlen Sie online bei Events mit Direktbuchung oder schreiben Sie uns zu allen anderen.</p>'),
    ('<h3>Disfruta</h3><p>Nos ocupamos de todo para que solo tengas que vivirlo.</p>',
     '<h3>Enjoy</h3><p>We take care of everything so all you have to do is enjoy it.</p>',
     '<h3>Si diverta</h3><p>Pensiamo a tutto noi: lei deve solo godersela.</p>',
     '<h3>Profitez</h3><p>Nous nous occupons de tout, il ne vous reste qu’à le vivre.</p>',
     '<h3>Genießen</h3><p>Wir kümmern uns um alles, Sie müssen es nur noch erleben.</p>'),

    # ── contacto ──
    ('<h2>¿Tienes una <em>idea</em> en mente?</h2>', '<h2>Got an <em>idea</em> in mind?</h2>', '<h2>Ha un’<em>idea</em> in mente?</h2>', '<h2>Vous avez une <em>idée</em> en tête ?</h2>', '<h2>Haben Sie eine <em>Idee</em>?</h2>'),
    ('<p>Cuéntanos qué quieres celebrar con unas preguntas rápidas y envíanoslo por WhatsApp o por email. Te respondemos con una propuesta a tu medida.</p>',
     '<p>Tell us what you want to celebrate by answering a few quick questions, then send it by WhatsApp or email. We will reply with a tailor-made proposal.</p>',
     '<p>Ci racconti cosa vuole festeggiare con poche domande veloci e ce lo invii via WhatsApp o email. Le risponderemo con una proposta su misura.</p>',
     '<p>Dites-nous ce que vous souhaitez célébrer en répondant à quelques questions rapides, puis envoyez-le par WhatsApp ou par e-mail. Nous vous répondrons avec une proposition sur mesure.</p>',
     '<p>Beantworten Sie ein paar kurze Fragen und senden Sie uns Ihre Wünsche per WhatsApp oder E-Mail. Sie erhalten ein Angebot nach Maß.</p>'),
    ('id="q-stepname">Paso 1 de 4 · Tu evento</div>', 'id="q-stepname">Step 1 of 4 · Your event</div>', 'id="q-stepname">Passo 1 di 4 · Il suo evento</div>', 'id="q-stepname">Étape 1 sur 4 · Votre événement</div>', 'id="q-stepname">Schritt 1 von 4 · Ihr Event</div>'),
    ('<legend>¿Qué quieres organizar o reservar?</legend>', '<legend>What would you like to organise or book?</legend>', '<legend>Cosa vuole organizzare o prenotare?</legend>', '<legend>Que souhaitez-vous organiser ou réserver ?</legend>', '<legend>Was möchten Sie organisieren oder buchen?</legend>'),
    ('<legend>¿Cuántas personas sois?</legend>', '<legend>How many people?</legend>', '<legend>In quante persone siete?</legend>', '<legend>Combien de personnes serez-vous ?</legend>', '<legend>Wie viele Personen sind Sie?</legend>'),
    ('value="2 a 8"><span>2 a 8</span>', 'value="2 to 8"><span>2 to 8</span>', 'value="Da 2 a 8"><span>Da 2 a 8</span>', 'value="2 à 8"><span>2 à 8</span>', 'value="2 bis 8"><span>2 bis 8</span>'),
    ('value="9 a 12"><span>9 a 12</span>', 'value="9 to 12"><span>9 to 12</span>', 'value="Da 9 a 12"><span>Da 9 a 12</span>', 'value="9 à 12"><span>9 à 12</span>', 'value="9 bis 12"><span>9 bis 12</span>'),
    ('value="13 a 20"><span>13 a 20</span>', 'value="13 to 20"><span>13 to 20</span>', 'value="Da 13 a 20"><span>Da 13 a 20</span>', 'value="13 à 20"><span>13 à 20</span>', 'value="13 bis 20"><span>13 bis 20</span>'),
    ('value="Más de 20"><span>Más de 20</span>', 'value="More than 20"><span>More than 20</span>', 'value="Più di 20"><span>Più di 20</span>', 'value="Plus de 20"><span>Plus de 20</span>', 'value="Mehr als 20"><span>Mehr als 20</span>'),
    ('>Elige una opción en cada pregunta para continuar.</p>', '>Choose an option for each question to continue.</p>', '>Scelga un’opzione per ogni domanda per continuare.</p>', '>Choisissez une option à chaque question pour continuer.</p>', '>Bitte wählen Sie bei jeder Frage eine Option.</p>'),
    ('>¿Cuándo te gustaría?</label>', '>When would you like it?</label>', '>Quando le piacerebbe?</label>', '>Quand souhaitez-vous venir ?</label>', '>Wann soll es sein?</label>'),
    ('<option value="">Elige una opción…</option>', '<option value="">Choose an option…</option>', '<option value="">Scelga un’opzione…</option>', '<option value="">Choisissez une option…</option>', '<option value="">Bitte wählen…</option>'),
    ('<option>Fallas 2027 (del 1 al 19 de marzo)</option>', '<option>Fallas 2027 (1–19 March)</option>', '<option>Fallas 2027 (dall’1 al 19 marzo)</option>', '<option>Fallas 2027 (du 1er au 19 mars)</option>', '<option>Fallas 2027 (1.–19. März)</option>'),
    ('<option>Diciembre 2026</option>', '<option>December 2026</option>', '<option>Dicembre 2026</option>', '<option>Décembre 2026</option>', '<option>Dezember 2026</option>'),
    ('<option>Enero 2027</option>', '<option>January 2027</option>', '<option>Gennaio 2027</option>', '<option>Janvier 2027</option>', '<option>Januar 2027</option>'),
    ('<option>Febrero 2027</option>', '<option>February 2027</option>', '<option>Febbraio 2027</option>', '<option>Février 2027</option>', '<option>Februar 2027</option>'),
    ('<option>Abril 2027</option>', '<option>April 2027</option>', '<option>Aprile 2027</option>', '<option>Avril 2027</option>', '<option>April 2027</option>'),
    ('<option>Mayo 2027</option>', '<option>May 2027</option>', '<option>Maggio 2027</option>', '<option>Mai 2027</option>', '<option>Mai 2027</option>'),
    ('<option>Junio 2027</option>', '<option>June 2027</option>', '<option>Giugno 2027</option>', '<option>Juin 2027</option>', '<option>Juni 2027</option>'),
    ('<option>Julio 2027</option>', '<option>July 2027</option>', '<option>Luglio 2027</option>', '<option>Juillet 2027</option>', '<option>Juli 2027</option>'),
    ('<option>Septiembre 2027</option>', '<option>September 2027</option>', '<option>Settembre 2027</option>', '<option>Septembre 2027</option>', '<option>September 2027</option>'),
    ('<option>Octubre 2027</option>', '<option>October 2027</option>', '<option>Ottobre 2027</option>', '<option>Octobre 2027</option>', '<option>Oktober 2027</option>'),
    ('<option>Noviembre 2027</option>', '<option>November 2027</option>', '<option>Novembre 2027</option>', '<option>Novembre 2027</option>', '<option>November 2027</option>'),
    ('<option>Diciembre 2027</option>', '<option>December 2027</option>', '<option>Dicembre 2027</option>', '<option>Décembre 2027</option>', '<option>Dezember 2027</option>'),
    ('<option>Aún por decidir</option>', '<option>Not decided yet</option>', '<option>Da decidere</option>', '<option>Pas encore décidé</option>', '<option>Noch offen</option>'),
    ('>Día concreto <span class="opt">(opcional)</span>', '>Specific day <span class="opt">(optional)</span>', '>Giorno preciso <span class="opt">(facoltativo)</span>', '>Date précise <span class="opt">(facultatif)</span>', '>Genaues Datum <span class="opt">(optional)</span>'),
    ('<legend>¿Mejor entre semana o en fin de semana? <span class="opt">(opcional)</span></legend>',
     '<legend>Weekday or weekend? <span class="opt">(optional)</span></legend>',
     '<legend>Meglio in settimana o nel fine settimana? <span class="opt">(facoltativo)</span></legend>',
     '<legend>Plutôt en semaine ou le week-end ? <span class="opt">(facultatif)</span></legend>',
     '<legend>Unter der Woche oder am Wochenende? <span class="opt">(optional)</span></legend>'),
    ('value="Entre semana"><span>Entre semana</span>', 'value="Weekday"><span>Weekday</span>', 'value="In settimana"><span>In settimana</span>', 'value="En semaine"><span>En semaine</span>', 'value="Unter der Woche"><span>Unter der Woche</span>'),
    ('value="Fin de semana"><span>Fin de semana</span>', 'value="Weekend"><span>Weekend</span>', 'value="Fine settimana"><span>Fine settimana</span>', 'value="Le week-end"><span>Le week-end</span>', 'value="Wochenende"><span>Wochenende</span>'),
    ('value="Me da igual"><span>Me da igual</span>', 'value="Either"><span>Either</span>', 'value="È indifferente"><span>È indifferente</span>', 'value="Peu importe"><span>Peu importe</span>', 'value="Egal"><span>Egal</span>'),
    ('<legend>¿A qué hora? <span class="opt">(puedes elegir varias)</span></legend>',
     '<legend>What time? <span class="opt">(choose any)</span></legend>',
     '<legend>A che ora? <span class="opt">(anche più di una)</span></legend>',
     '<legend>À quel moment ? <span class="opt">(plusieurs choix possibles)</span></legend>',
     '<legend>Zu welcher Zeit? <span class="opt">(mehrere möglich)</span></legend>'),
    ('value="Mañana"><span>Mañana</span>', 'value="Morning"><span>Morning</span>', 'value="Mattina"><span>Mattina</span>', 'value="Matin"><span>Matin</span>', 'value="Vormittag"><span>Vormittag</span>'),
    ('value="Mediodía"><span>Mediodía</span>', 'value="Midday"><span>Midday</span>', 'value="Mezzogiorno"><span>Mezzogiorno</span>', 'value="Midi"><span>Midi</span>', 'value="Mittag"><span>Mittag</span>'),
    ('value="Tarde"><span>Tarde</span>', 'value="Afternoon"><span>Afternoon</span>', 'value="Pomeriggio"><span>Pomeriggio</span>', 'value="Après-midi"><span>Après-midi</span>', 'value="Nachmittag"><span>Nachmittag</span>'),
    ('value="Noche"><span>Noche</span>', 'value="Evening"><span>Evening</span>', 'value="Sera"><span>Sera</span>', 'value="Soirée"><span>Soirée</span>', 'value="Abend"><span>Abend</span>'),
    ('>Elige cuándo te gustaría para continuar.</p>', '>Tell us when you would like it to continue.</p>', '>Indichi quando le piacerebbe per continuare.</p>', '>Indiquez la période souhaitée pour continuer.</p>', '>Bitte wählen Sie einen Zeitraum.</p>'),
    ('<legend>¿Qué te interesa? <span class="opt">(puedes elegir varias)</span></legend>',
     '<legend>What are you interested in? <span class="opt">(choose any)</span></legend>',
     '<legend>Cosa le interessa? <span class="opt">(anche più di una)</span></legend>',
     '<legend>Qu’est-ce qui vous intéresse ? <span class="opt">(plusieurs choix possibles)</span></legend>',
     '<legend>Was interessiert Sie? <span class="opt">(mehrere möglich)</span></legend>'),
    ('value="Espacio privado"><span>Espacio privado</span>', 'value="Private space"><span>Private space</span>', 'value="Spazio privato"><span>Spazio privato</span>', 'value="Espace privé"><span>Espace privé</span>', 'value="Privater Raum"><span>Privater Raum</span>'),
    ('value="Balcón para la mascletà"><span>Balcón para la mascletà</span>', 'value="Balcony for the mascletà"><span>Balcony for the mascletà</span>', 'value="Balcone per la mascletà"><span>Balcone per la mascletà</span>', 'value="Balcon pour la mascletà"><span>Balcon pour la mascletà</span>', 'value="Balkon zur Mascletà"><span>Balkon zur Mascletà</span>'),
    ('value="Catering"><span>Catering</span>', 'value="Catering"><span>Catering</span>', 'value="Catering"><span>Catering</span>', 'value="Traiteur"><span>Traiteur</span>', 'value="Catering"><span>Catering</span>'),
    ('value="Alojamiento para invitados"><span>Alojamiento para invitados</span>', 'value="Guest accommodation"><span>Guest accommodation</span>', 'value="Alloggio per gli ospiti"><span>Alloggio per gli ospiti</span>', 'value="Hébergement des invités"><span>Hébergement des invités</span>', 'value="Übernachtung für Gäste"><span>Übernachtung für Gäste</span>'),
    ('value="Decoración"><span>Decoración</span>', 'value="Decoration"><span>Decoration</span>', 'value="Decorazione"><span>Decorazione</span>', 'value="Décoration"><span>Décoration</span>', 'value="Dekoration"><span>Dekoration</span>'),
    ('<legend>Catering: ¿qué tipo? <span class="opt">(puedes elegir varios)</span></legend>',
     '<legend>Catering: what kind? <span class="opt">(choose any)</span></legend>',
     '<legend>Catering: di che tipo? <span class="opt">(anche più di uno)</span></legend>',
     '<legend>Traiteur : quelle formule ? <span class="opt">(plusieurs choix possibles)</span></legend>',
     '<legend>Catering: welche Art? <span class="opt">(mehrere möglich)</span></legend>'),
    ('value="Aperitivo"><span>Aperitivo</span>', 'value="Appetisers"><span>Appetisers</span>', 'value="Aperitivo"><span>Aperitivo</span>', 'value="Apéritif"><span>Apéritif</span>', 'value="Aperitif"><span>Aperitif</span>'),
    ('value="Comida"><span>Comida</span>', 'value="Lunch"><span>Lunch</span>', 'value="Pranzo"><span>Pranzo</span>', 'value="Déjeuner"><span>Déjeuner</span>', 'value="Mittagessen"><span>Mittagessen</span>'),
    ('value="Cena"><span>Cena</span>', 'value="Dinner"><span>Dinner</span>', 'value="Cena"><span>Cena</span>', 'value="Dîner"><span>Dîner</span>', 'value="Abendessen"><span>Abendessen</span>'),
    ('value="Brunch o café"><span>Brunch o café</span>', 'value="Brunch or coffee"><span>Brunch or coffee</span>', 'value="Brunch o caffè"><span>Brunch o caffè</span>', 'value="Brunch ou café"><span>Brunch ou café</span>', 'value="Brunch oder Kaffee"><span>Brunch oder Kaffee</span>'),
    ('<legend>Presupuesto aproximado <span class="opt">(opcional)</span></legend>',
     '<legend>Approximate budget <span class="opt">(optional)</span></legend>',
     '<legend>Budget indicativo <span class="opt">(facoltativo)</span></legend>',
     '<legend>Budget approximatif <span class="opt">(facultatif)</span></legend>',
     '<legend>Ungefähres Budget <span class="opt">(optional)</span></legend>'),
    ('value="Hasta 500 €"><span>Hasta 500 €</span>', 'value="Up to 500 €"><span>Up to 500 €</span>', 'value="Fino a 500 €"><span>Fino a 500 €</span>', 'value="Jusqu’à 500 €"><span>Jusqu’à 500 €</span>', 'value="Bis 500 €"><span>Bis 500 €</span>'),
    ('value="De 500 a 1.000 €"><span>De 500 a 1.000 €</span>', 'value="500 to 1,000 €"><span>500 to 1,000 €</span>', 'value="Da 500 a 1.000 €"><span>Da 500 a 1.000 €</span>', 'value="De 500 à 1 000 €"><span>De 500 à 1 000 €</span>', 'value="500 bis 1.000 €"><span>500 bis 1.000 €</span>'),
    ('value="De 1.000 a 2.000 €"><span>De 1.000 a 2.000 €</span>', 'value="1,000 to 2,000 €"><span>1,000 to 2,000 €</span>', 'value="Da 1.000 a 2.000 €"><span>Da 1.000 a 2.000 €</span>', 'value="De 1 000 à 2 000 €"><span>De 1 000 à 2 000 €</span>', 'value="1.000 bis 2.000 €"><span>1.000 bis 2.000 €</span>'),
    ('value="Más de 2.000 €"><span>Más de 2.000 €</span>', 'value="Over 2,000 €"><span>Over 2,000 €</span>', 'value="Più di 2.000 €"><span>Più di 2.000 €</span>', 'value="Plus de 2 000 €"><span>Plus de 2 000 €</span>', 'value="Über 2.000 €"><span>Über 2.000 €</span>'),
    ('value="Aún no lo sé"><span>Aún no lo sé</span>', 'value="Not sure yet"><span>Not sure yet</span>', 'value="Non lo so ancora"><span>Non lo so ancora</span>', 'value="Je ne sais pas encore"><span>Je ne sais pas encore</span>', 'value="Weiß ich noch nicht"><span>Weiß ich noch nicht</span>'),
    ('>Tu nombre</label>', '>Your name</label>', '>Il suo nome</label>', '>Votre nom</label>', '>Ihr Name</label>'),
    ('>Teléfono <span class="opt">(opcional)</span>', '>Phone <span class="opt">(optional)</span>', '>Telefono <span class="opt">(facoltativo)</span>', '>Téléphone <span class="opt">(facultatif)</span>', '>Telefon <span class="opt">(optional)</span>'),
    ('>Email <span class="opt">(opcional)</span>', '>Email <span class="opt">(optional)</span>', '>Email <span class="opt">(facoltativo)</span>', '>E-mail <span class="opt">(facultatif)</span>', '>E-Mail <span class="opt">(optional)</span>'),
    ('<legend>Prefiero que me respondáis por <span class="opt">(opcional)</span></legend>',
     '<legend>I prefer a reply by <span class="opt">(optional)</span></legend>',
     '<legend>Preferisco ricevere risposta via <span class="opt">(facoltativo)</span></legend>',
     '<legend>Je préfère une réponse par <span class="opt">(facultatif)</span></legend>',
     '<legend>Antwort bitte per <span class="opt">(optional)</span></legend>'),
    ('value="Teléfono"><span>Teléfono</span>', 'value="Phone"><span>Phone</span>', 'value="Telefono"><span>Telefono</span>', 'value="Téléphone"><span>Téléphone</span>', 'value="Telefon"><span>Telefon</span>'),
    ('value="Email"><span>Email</span>', 'value="Email"><span>Email</span>', 'value="Email"><span>Email</span>', 'value="E-mail"><span>E-mail</span>', 'value="E-Mail"><span>E-Mail</span>'),
    ('>¿Algo más? <span class="opt">(opcional)</span></label>', '>Anything else? <span class="opt">(optional)</span></label>', '>Altro? <span class="opt">(facoltativo)</span></label>', '>Autre chose ? <span class="opt">(facultatif)</span></label>', '>Sonst noch etwas? <span class="opt">(optional)</span></label>'),
    ('placeholder="Solo si quieres añadir algo"', 'placeholder="Only if you want to add something"', 'placeholder="Solo se vuole aggiungere qualcosa"', 'placeholder="Seulement si vous souhaitez ajouter quelque chose"', 'placeholder="Nur wenn Sie etwas ergänzen möchten"'),
    ('>Escribe tu nombre para poder enviarlo.</p>', '>Please enter your name to send it.</p>', '>Scriva il suo nome per poter inviare.</p>', '>Indiquez votre nom pour l’envoyer.</p>', '>Bitte geben Sie Ihren Namen ein.</p>'),
    ('id="q-back">Atrás</button>', 'id="q-back">Back</button>', 'id="q-back">Indietro</button>', 'id="q-back">Retour</button>', 'id="q-back">Zurück</button>'),
    ('id="q-back2">Atrás</button>', 'id="q-back2">Back</button>', 'id="q-back2">Indietro</button>', 'id="q-back2">Retour</button>', 'id="q-back2">Zurück</button>'),
    ('id="q-next">Siguiente</button>', 'id="q-next">Next</button>', 'id="q-next">Avanti</button>', 'id="q-next">Suivant</button>', 'id="q-next">Weiter</button>'),
    ('>Enviar por WhatsApp</button>', '>Send by WhatsApp</button>', '>Invia con WhatsApp</button>', '>Envoyer par WhatsApp</button>', '>Per WhatsApp senden</button>'),
    ('>Enviar por email</button>', '>Send by email</button>', '>Invia per email</button>', '>Envoyer par e-mail</button>', '>Per E-Mail senden</button>'),
    ('>Se abrirá WhatsApp o tu correo con el mensaje ya escrito; solo tienes que enviarlo.</p>',
     '>WhatsApp or your email app will open with the message ready; you just need to send it.</p>',
     '>Si aprirà WhatsApp o la sua email con il messaggio già scritto: basta inviarlo.</p>',
     '>WhatsApp ou votre messagerie s’ouvrira avec le message déjà rédigé ; il ne reste qu’à l’envoyer.</p>',
     '>WhatsApp oder Ihr E-Mail-Programm öffnet sich mit der fertigen Nachricht; Sie müssen sie nur noch senden.</p>'),
    ('>¿Prefieres escribirnos directamente? <a', '>Prefer to write to us directly? <a', '>Preferisce scriverci direttamente? <a', '>Vous préférez nous écrire directement ? <a', '>Lieber direkt schreiben? <a'),
    ('<br>¿O llamar? <a', '<br>Or give us a call? <a', '<br>O chiamarci? <a', '<br>Ou nous appeler ? <a', '<br>Oder anrufen? <a'),

    # ── web del hotel y pie ──
    ('aria-label="Visitar la web del Hotel Venecia Plaza Centro"', 'aria-label="Visit the Hotel Venecia Plaza Centro website"', 'aria-label="Visiti il sito dell’Hotel Venecia Plaza Centro"', 'aria-label="Visiter le site de l’Hotel Venecia Plaza Centro"', 'aria-label="Website des Hotel Venecia Plaza Centro besuchen"'),
    ('<span>Visita nuestra web</span>', '<span>Visit our website</span>', '<span>Visiti il nostro sito</span>', '<span>Visitez notre site</span>', '<span>Besuchen Sie unsere Website</span>'),
    ('<div><strong>Eventos</strong><a href="#fallas">Fallas 2027</a><a href="#proximos">Próximos eventos</a><a href="#tu-evento">Tu evento</a></div>',
     '<div><strong>Events</strong><a href="#fallas">Fallas 2027</a><a href="#proximos">Upcoming events</a><a href="#tu-evento">Your event</a></div>',
     '<div><strong>Eventi</strong><a href="#fallas">Fallas 2027</a><a href="#proximos">Prossimi eventi</a><a href="#tu-evento">Il suo evento</a></div>',
     '<div><strong>Événements</strong><a href="#fallas">Fallas 2027</a><a href="#proximos">Prochains événements</a><a href="#tu-evento">Votre événement</a></div>',
     '<div><strong>Events</strong><a href="#fallas">Fallas 2027</a><a href="#proximos">Nächste Events</a><a href="#tu-evento">Ihr Event</a></div>'),
    ('<strong>Legal</strong><a href="#">Condiciones de reserva</a><a href="#">Privacidad</a><a href="#">Aviso legal</a>',
     '<strong>Legal</strong><a href="#">Booking conditions</a><a href="#">Privacy</a><a href="#">Legal notice</a>',
     '<strong>Note legali</strong><a href="#">Condizioni di prenotazione</a><a href="#">Privacy</a><a href="#">Note legali</a>',
     '<strong>Informations légales</strong><a href="#">Conditions de réservation</a><a href="#">Confidentialité</a><a href="#">Mentions légales</a>',
     '<strong>Rechtliches</strong><a href="#">Buchungsbedingungen</a><a href="#">Datenschutz</a><a href="#">Impressum</a>'),

    # ── textos dentro del JavaScript ──
    ("add('Organizar mi propio evento','Organizar mi propio evento',false);",
     "add('Organise my own event','Organise my own event',false);",
     "add('Organizzare il mio evento','Organizzare il mio evento',false);",
     "add('Organiser mon propre événement','Organiser mon propre événement',false);",
     "add('Mein eigenes Event planen','Mein eigenes Event planen',false);"),
    ("(off?' · Sold out':'')", "(off?' · Sold out':'')", "(off?' · Esaurito':'')", "(off?' · Complet':'')", "(off?' · Ausgebucht':'')"),
    ("var steps=[].slice.call(f.querySelectorAll('.qstep')), cur=0;\n  var names=['Tu evento','Cuándo','Qué necesitas','Tus datos'];",
     "var steps=[].slice.call(f.querySelectorAll('.qstep')), cur=0;\n  var names=['Your event','When','What you need','Your details'];",
     "var steps=[].slice.call(f.querySelectorAll('.qstep')), cur=0;\n  var names=['Il suo evento','Quando','Cosa le serve','I suoi dati'];",
     "var steps=[].slice.call(f.querySelectorAll('.qstep')), cur=0;\n  var names=['Votre événement','Quand','Vos besoins','Vos coordonnées'];",
     "var steps=[].slice.call(f.querySelectorAll('.qstep')), cur=0;\n  var names=['Ihr Event','Wann','Was Sie brauchen','Ihre Angaben'];"),
    ("L.push('Tipo de evento: '+val('tipo')); L.push('Personas: '+val('personas'));",
     "L.push('Type of event: '+val('tipo')); L.push('People: '+val('personas'));",
     "L.push('Tipo di evento: '+val('tipo')); L.push('Persone: '+val('personas'));",
     "L.push('Type d’événement : '+val('tipo')); L.push('Personnes : '+val('personas'));",
     "L.push('Art des Events: '+val('tipo')); L.push('Personen: '+val('personas'));"),
    ("L.push('Fecha: '+fe);", "L.push('Date: '+fe);", "L.push('Data: '+fe);", "L.push('Date : '+fe);", "L.push('Datum: '+fe);"),
    ("L.push('Día: '+val('semana'));", "L.push('Day: '+val('semana'));", "L.push('Giorno: '+val('semana'));", "L.push('Jour : '+val('semana'));", "L.push('Tag: '+val('semana'));"),
    ("L.push('Horario: '+all('hora')", "L.push('Time: '+all('hora')", "L.push('Orario: '+all('hora')", "L.push('Horaire : '+all('hora')", "L.push('Uhrzeit: '+all('hora')"),
    ("L.push('Me interesa: '+all('interes')", "L.push('Interested in: '+all('interes')", "L.push('Mi interessa: '+all('interes')", "L.push('Intéressé(e) par : '+all('interes')", "L.push('Interesse an: '+all('interes')"),
    ("L.push('Catering: '+all('catering')", "L.push('Catering: '+all('catering')", "L.push('Catering: '+all('catering')", "L.push('Traiteur : '+all('catering')", "L.push('Catering: '+all('catering')"),
    ("L.push('Presupuesto: '+val('presupuesto'));", "L.push('Budget: '+val('presupuesto'));", "L.push('Budget: '+val('presupuesto'));", "L.push('Budget : '+val('presupuesto'));", "L.push('Budget: '+val('presupuesto'));"),
    ("L.push('Nombre: '+val('nombre'));", "L.push('Name: '+val('nombre'));", "L.push('Nome: '+val('nombre'));", "L.push('Nom : '+val('nombre'));", "L.push('Name: '+val('nombre'));"),
    ("L.push('Teléfono: '+val('telefono'));", "L.push('Phone: '+val('telefono'));", "L.push('Telefono: '+val('telefono'));", "L.push('Téléphone : '+val('telefono'));", "L.push('Telefon: '+val('telefono'));"),
    ("L.push('Email: '+val('email'));", "L.push('Email: '+val('email'));", "L.push('Email: '+val('email'));", "L.push('E-mail : '+val('email'));", "L.push('E-Mail: '+val('email'));"),
    ("L.push('Prefiero respuesta por: '+val('respuesta'));", "L.push('Preferred reply by: '+val('respuesta'));", "L.push('Preferisco risposta via: '+val('respuesta'));", "L.push('Réponse souhaitée par : '+val('respuesta'));", "L.push('Antwort bitte per: '+val('respuesta'));"),
    ("L.push('Comentarios: '+val('comentarios'));", "L.push('Comments: '+val('comentarios'));", "L.push('Commenti: '+val('comentarios'));", "L.push('Commentaires : '+val('comentarios'));", "L.push('Anmerkungen: '+val('comentarios'));"),
    ("return 'Hola, quiero pedir presupuesto para un evento en el Hotel Venecia.\\n\\n'",
     "return 'Hello, I would like a quote for an event at Hotel Venecia.\\n\\n'",
     "return 'Buongiorno, vorrei un preventivo per un evento all’Hotel Venecia.\\n\\n'",
     "return 'Bonjour, je souhaite un devis pour un événement à l’Hotel Venecia.\\n\\n'",
     "return 'Guten Tag, ich hätte gern ein Angebot für ein Event im Hotel Venecia.\\n\\n'"),
    ("$('q-stepname').textContent='Paso '+(i+1)+' de 4 · '+names[i];",
     "$('q-stepname').textContent='Step '+(i+1)+' of 4 · '+names[i];",
     "$('q-stepname').textContent='Passo '+(i+1)+' di 4 · '+names[i];",
     "$('q-stepname').textContent='Étape '+(i+1)+' sur 4 · '+names[i];",
     "$('q-stepname').textContent='Schritt '+(i+1)+' von 4 · '+names[i];"),
    ("'<b>Tu solicitud</b><ul>'", "'<b>Your request</b><ul>'", "'<b>La sua richiesta</b><ul>'", "'<b>Votre demande</b><ul>'", "'<b>Ihre Anfrage</b><ul>'"),
    ("all('interes').indexOf('Catering')<0", "all('interes').indexOf('Catering')<0", "all('interes').indexOf('Catering')<0", "all('interes').indexOf('Traiteur')<0", "all('interes').indexOf('Catering')<0"),
    ("encodeURIComponent('Consulta de evento · Hotel Venecia')",
     "encodeURIComponent('Event enquiry · Hotel Venecia')",
     "encodeURIComponent('Richiesta evento · Hotel Venecia')",
     "encodeURIComponent('Demande d’événement · Hotel Venecia')",
     "encodeURIComponent('Event-Anfrage · Hotel Venecia')"),
    ("lb.setAttribute('aria-label','Fotos ampliadas');", "lb.setAttribute('aria-label','Enlarged photos');", "lb.setAttribute('aria-label','Foto ingrandite');", "lb.setAttribute('aria-label','Photos agrandies');", "lb.setAttribute('aria-label','Vergrößerte Fotos');"),
    ('class="lb-x" aria-label="Cerrar"', 'class="lb-x" aria-label="Close"', 'class="lb-x" aria-label="Chiudi"', 'class="lb-x" aria-label="Fermer"', 'class="lb-x" aria-label="Schließen"'),
    ('class="lb-prev" aria-label="Anterior"', 'class="lb-prev" aria-label="Previous"', 'class="lb-prev" aria-label="Precedente"', 'class="lb-prev" aria-label="Précédente"', 'class="lb-prev" aria-label="Zurück"'),
    ('class="lb-next" aria-label="Siguiente"', 'class="lb-next" aria-label="Next"', 'class="lb-next" aria-label="Successiva"', 'class="lb-next" aria-label="Suivante"', 'class="lb-next" aria-label="Weiter"'),
    ("f.setAttribute('aria-label','Ampliar foto');", "f.setAttribute('aria-label','Enlarge photo');", "f.setAttribute('aria-label','Ingrandisci la foto');", "f.setAttribute('aria-label','Agrandir la photo');", "f.setAttribute('aria-label','Foto vergrößern');"),
    ("open?'Cerrar menú':'Abrir menú'", "open?'Close menu':'Open menu'", "open?'Chiudi il menu':'Apri il menu'", "open?'Fermer le menu':'Ouvrir le menu'", "open?'Menü schließen':'Menü öffnen'"),
]

# Enlaces a las otras webs del hotel en el idioma de la página (se aplican después de los textos).
def enlaces(html, lang):
    cambios = [
        (f'href="{FALLAS}/">', f'href="{FALLAS}/{lang}/">'),
        ('href="https://hotelvenecia.com"', f'href="https://hotelvenecia.com/{lang}/"'),
    ]
    for a, b in cambios:
        if a not in html:
            sys.exit(f'[{lang}] no encuentro el enlace: {a}')
        html = html.replace(a, b)
    return html


def selector(html, lang):
    """Rehace los dos selectores de idioma para una página que vive en /<lang>/."""
    nombres = [('es', 'Español'), ('en', 'English'), ('it', 'Italiano'), ('fr', 'Français'), ('de', 'Deutsch')]

    def url(code):
        if code == lang:
            return './'
        return '../' if code == 'es' else f'../{code}/'

    def lista(corto):
        activo = ' class="on"'
        return ''.join(
            f'<a href="{url(c)}" hreflang="{c}" lang="{c}"{activo if c == lang else ""}>{c.upper() if corto else n}</a>'
            for c, n in nombres
        )

    for marca, corto in (('LANGS', False), ('MLANGS', True)):
        html, n = re.subn(f'<!--{marca}-->.*?<!--/{marca}-->', lambda _m: f'<!--{marca}-->{lista(corto)}<!--/{marca}-->', html, flags=re.S)
        if n != 1:
            sys.exit(f'[{lang}] no encuentro el selector {marca}')
    if '>ES ▾</button>' not in html:
        sys.exit(f'[{lang}] no encuentro el botón del selector')
    return html.replace('>ES ▾</button>', f'>{lang.upper()} ▾</button>')


def rutas(html, lang):
    """Las páginas traducidas viven en una subcarpeta: las rutas a fotos, fuentes e iconos suben un nivel."""
    html = html.replace('src="img/', 'src="../img/').replace('url(img/', 'url(../img/').replace('url(fonts/', 'url(../fonts/')
    html = re.sub(r'href="(favicon[^"]*|apple-touch-icon\.png)"', r'href="../\1"', html)
    canon = '<link rel="canonical" href="https://eventos.hotelvenecia.com/">'
    if canon not in html:
        sys.exit(f'[{lang}] no encuentro el canonical')
    return html.replace(canon, f'<link rel="canonical" href="https://eventos.hotelvenecia.com/{lang}/">')


def main():
    base = (RAIZ / 'index.html').read_text(encoding='utf-8')
    faltan = [t[0] for t in TEXTOS if t[0] not in base]
    if faltan:
        print('Estos textos ya no están en la página en español. Actualiza TEXTOS en este script:')
        for f in faltan:
            print('  -', f[:140])
        sys.exit(1)

    for i, lang in enumerate(IDIOMAS, start=1):
        # Primero se marcan todos los fragmentos y después se sustituyen, para que una
        # traducción no pueda volver a coincidir con un fragmento posterior en español.
        html = base
        pendientes = []
        for k, t in sorted(enumerate(TEXTOS), key=lambda kt: -len(kt[1][0])):
            marca = f'\x00{k}\x00'
            if t[0] in html:
                html = html.replace(t[0], marca)
                pendientes.append((marca, t[i]))
            elif not any(t[0] in otro[0] for otro in TEXTOS if otro is not t):
                sys.exit(f'[{lang}] fragmento sin usar: {t[0][:120]}')
        for marca, texto in pendientes:
            html = html.replace(marca, texto)
        html = rutas(selector(enlaces(html, lang), lang), lang)
        destino = RAIZ / lang / 'index.html'
        destino.parent.mkdir(exist_ok=True)
        destino.write_text(html, encoding='utf-8')
        print(f'{lang}: {destino.relative_to(RAIZ.parent)} ({len(html):,} bytes)')


if __name__ == '__main__':
    main()
