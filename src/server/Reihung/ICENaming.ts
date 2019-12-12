// List from https://de.wikipedia.org/wiki/Liste_nach_Gemeinden_und_Regionen_benannter_IC/ICE-Fahrzeuge#Namensgebung_ICE-Triebz%C3%BCge_nach_Gemeinden

const naming = {
  4712: 'Dillingen a.d. Donau',
  4601: 'Europa/Europe',
  1183: 'Oberursel (Taunus)',
  363: 'Weilheim i. OB',
  187: 'Mühldorf a. Inn ',
  101: 'Gießen',
  331: 'Westerland/Sylt',
  357: 'Esslingen am Neckar ',
  333: 'Goslar',
  4717: 'Paris',
  102: 'Jever ',
  4604: 'Brussel/Bruxelles',
  175: 'Nürnberg',
  173: 'Basel',
  177: 'Rendsburg',
  118: 'Gelnhausen',
  320: 'Weil am Rhein',
  186: 'Chur',
  354: 'Mittenwald',
  1155: 'Mühlhausen/Thüringen',
  355: 'Tuttlingen',
  308: 'Murnau am Staffelsee',
  353: 'Neu-Ulm',
  1505: 'Marburg/Lahn',
  104: 'Fulda',
  172: 'Aschaffenburg',
  182: 'Rüdesheim',
  1174: 'Hansestadt Warburg',
  1168: 'Ellwangen',
  180: 'Castrop-Rauxel',
  1170: 'Prenzlau',
  1164: 'Rödental',
  1175: 'Villingen-Schwenningen',
  1166: 'Bingen am Rhein',
  327: 'Siegen',
  362: 'Schwerte (Ruhr)',
  1151: 'Elsterwerda',
  360: 'Linz am Rhein',
  1163: 'Ostseebad Binz',
  103: 'Neu-Isenburg',
  352: 'Mönchengladbach',
  1167: 'Traunstein',
  1169: 'Tutzing',
  1162: 'Vaihingen an der Enz',
  1157: 'Innsbruck',
  1161: 'Andernach',
  1158: 'Falkenberg/Elster',
  225: 'Oldenburg (Oldb)',
  228: 'Altenburg',
  215: 'Bitterfeld-Wolfen',
  359: 'Leverkusen',
  171: 'Heusenstamm',
  1152: 'Travemünde',
  361: 'Celle',
  160: 'Mülheim an der Ruhr',
  237: 'Neustrelitz',
  1192: 'Linz',
  1154: 'Sonneberg',
  154: 'Flensburg',
  211: 'Uelzen',
  156: 'Heppenheim/Bergstraße ',
  185: 'Freilassing',
  323: 'Schaffhausen',
  309: 'Aalen',
  188: 'Hildesheim',
  315: 'Singen (Hohentwiel)',
  358: 'St. Ingbert',
  335: 'Konstanz',
  1190: 'Wien',
  181: 'Interlaken',
  213: 'Nauen',
  1172: 'Bamberg',
  183: 'Timmendorfer Strand',
  326: 'Neunkirchen',
  324: 'Fürth',
  1153: 'Ilmenau',
  157: 'Landshut',
  1178: 'Ostseebad Warnemünde',
  1160: 'Markt Holzkirchen',
  222: 'Eberswalde',
  236: 'Jüterbog',
  4685: 'Schwäbisch Hall',
  4684: 'Forbach-Lorraine',
  1522: 'Torgau',
  1182: 'Mainz',
  1191: 'Salzburg',
  1523: 'Hansestadt Greifswald',
  1521: 'Homburg/Saar',
  1181: 'Horb am Neckar',
  1520: 'Gotha',
  1180: 'Darmstadt',
  1176: 'Coburg',
  1173: 'Halle (Saale)',
  4683: 'Limburg an der Lahn',
  314: 'Bergisch Gladbach',
  312: 'Montabaur',
  1524: 'Hansestadt Rostock',
  1184: 'Kaiserslautern',
  169: 'Worms',
  4680: 'Würzburg',
  1177: 'Rathenow',
  1156: 'Waren (Müritz)',
  351: 'Herford',
  1165: 'Bad Oeynhausen',
  4682: 'Köln',
  1171: 'Oschatz',
  210: 'Fontanestadt Neuruppin',
  167: 'Garmisch-Partenkirchen',
  106: 'Itzehoe',
  174: 'Zürich',
  107: 'Plattling',
  162: 'Geisenheim/Rheingau',
  201: 'Rheinsberg',
  117: 'Hof',
  220: 'Meiningen',
  217: 'Bergen auf Rügen',
  238: 'Saarbrücken',
  114: 'Friedrichshafen',
  113: 'Frankenthal/Pfalz',
  1111: 'Hansestadt Wismar',
  1108: 'Berlin',
  1128: 'Reutlingen',
  168: 'Crailsheim',
  230: 'Delitzsch',
  313: 'Treuchtlingen',
  1159: 'Passau',
  110: 'Gelsenkirchen',
  307: 'Oberhausen',
  1132: 'Wittenberge',
  227: 'Ludwigslust',
  205: 'Zwickau',
  108: 'Lichtenfels',
  158: 'Gütersloh',
  124: 'Hanau',
  116: 'Pforzheim',
  1117: 'Erlangen',
  224: 'Saalfeld (Saale)',
  243: 'Bautzen/Budyšin',
  1131: 'Trier',
  231: 'Brandenburg an der Havel',
  242: 'Quedlinburg',
  1125: 'Arnstadt',
  325: 'Ravensburg',
  221: 'Lübbenau/Spreewald',
  1118: 'Plauen/Vogtland',
  159: 'Bad Oldesloe',
  302: 'Hansestadt Lübeck',
  115: 'Regensburg',
  112: 'Memmingen',
  190: 'Ludwigshafen am Rhein',
  241: 'Bad Hersfeld',
  235: 'Görlitz',
  336: 'Ingolstadt',
  334: 'Offenburg',
  1110: 'Naumburg (Saale)',
  321: 'Krefeld',
  178: 'Bremerhaven',
  1119: 'Meißen',
  305: 'Baden-Baden',
  319: 'Duisburg',
  4651: 'Amsterdam',
  223: 'Schwerin',
  1102: 'Neubrandenburg',
  214: 'Hamm (Westf.)',
  209: 'Riesa',
  105: 'Offenbach am Main',
  153: 'Neumünster',
  120: 'Lüneburg',
  184: 'Bruchsal',
  316: 'Siegburg',
  219: 'Hagen',
  161: 'Bebra',
  317: 'Recklinghausen',
  1503: 'Altenbeken',
  318: 'Münster (Westf.)',
  240: 'Bochum',
  328: 'Aachen',
  322: 'Solingen',
  202: 'Wuppertal',
  1101: 'Neustadt an der Weinstraße',
  1103: 'Paderborn',
  234: 'Minden',
  1109: 'Güstrow',
  232: 'Frankfurt (Oder)',
  119: 'Osnabrück',
  1107: 'Pirna',
  1113: 'Hansestadt Stralsund',
  1501: 'Eisenach',
  155: 'Rosenheim',
  244: 'Koblenz',
  4652: 'Arnhem',
  212: 'Potsdam',
  4603: 'Mannheim',
  301: 'Freiburg im Breisgau',
  310: 'Wolfsburg',
  330: 'Göttingen',
  1127: 'Weimar',
  207: 'Stendal',
  304: 'München',
  4607: 'Hannover',
  1105: 'Dresden',
  1502: 'Karlsruhe',
  1506: 'Kassel',
  208: 'Bonn',
  311: 'Wiesbaden',
  1126: 'Leipzig',
  216: 'Dessau',
  176: 'Bremen',
  4611: 'Düsseldorf',
  203: 'Cottbus/Chóśebuz',
  1504: 'Heidelberg',
  303: 'Dortmund',
  1130: 'Jena',
  226: 'Lutherstadt Wittenberg',
  206: 'Magdeburg',
  1104: 'Erfurt',
  332: 'Augsburg',
  1129: 'Kiel',
  239: 'Essen',
  337: 'Stuttgart',
  233: 'Ulm',
  204: 'Bielefeld',
  218: 'Braunschweig',
  1112: 'Freie und Hansestadt Hamburg',
  4610: 'Frankfurt am Main',
  9006: 'Martin Luther',
  9018: 'Freistaat Bayern',
  9025: 'Nordrhein-Westfalen',
  9026: 'Zürichsee',
};

export default (tzn?: string): string | undefined => {
  // @ts-ignore
  if (tzn) return naming[Number.parseInt(tzn, 10)];
};
