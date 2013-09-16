import unicodecsv
from collections import defaultdict
import datetime

banks = [
'FIX - USD',
'BTMU',
'Barclays',
'BOA',
'Citi',
'Credit Suisse',
'Deutsche',
'HBOS',
'HSBC',
'JPM',
'Lloyds',
# 'Nornichuck',
# 'Rabo',
'RBS',
'UBS',
'WestLB']


def process_libor_data(XM = '3M'):
    """ select a rate-estimate column, by default the three monthly """ 
    libor_data = unicodecsv.DictReader(open('libor.csv'))
    data = []
    for d in libor_data:
        data.append(d)

    col_sample = defaultdict(dict)
    for dp in data:
        if dp['Bank/Fixed'] in banks:
            col_sample[dp['Date']][dp['Bank/Fixed']] = dp[XM]

    row_data = []
    for k,v in col_sample.items():
        v.update({'date': k})
        row_data.append(v)  

    row_data.sort(key = lambda x: datetime.datetime.strptime(x['date'], '%d/%m/%Y'))

    writer = unicodecsv.DictWriter(open('libor_data_%s.csv'%XM, 'w'), ['date'] + banks)
    writer.writeheader()

    for row in row_data:
        writer.writerow(row)


process_libor_data()


