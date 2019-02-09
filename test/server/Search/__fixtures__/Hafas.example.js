// @flow
import iconv from 'iconv-lite';

export default iconv.encode(
  // eslint-disable-next-line max-len
  `SLs.sls={"suggestions":[
  {
    "value": "HAMBURG",
    "id": "A=1@O=HAMBURG@X=9997434@Y=53557110@U=81@L=008096009@B=1@p=1541033889@",
    "extId": "008096009",
    "type": "1",
    "typeStr": "[Bhf/Hst]",
    "xcoord": "9997434",
    "ycoord": "53557110",
    "state": "id",
    "prodClass": "95",
    "weight": "27179"
  },
  {
    "value": "Hamburg Dammtor",
    "id": "A=1@O=Hamburg Dammtor@X=9989569@Y=53560751@U=81@L=008002548@B=1@p=1541033889@",
    "extId": "008002548",
    "type": "1",
    "typeStr": "[Bhf/Hst]",
    "xcoord": "9989569",
    "ycoord": "53560751",
    "state": "id",
    "prodClass": "27",
    "weight": "27070"
  },
  {
    "value": "Hamburg Hbf",
    "id": "A=1@O=Hamburg Hbf@X=10006909@Y=53552733@U=81@L=008002549@B=1@p=1541033889@",
    "extId": "008002549",
    "type": "1",
    "typeStr": "[Bhf/Hst]",
    "xcoord": "10006909",
    "ycoord": "53552733",
    "state": "id",
    "prodClass": "31",
    "weight": "27175"
  }
]
};SLs.showSuggestion();`,
  'latin-1'
);
