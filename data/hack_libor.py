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
    from collections import defaultdict
    libor_data = unicodecsv.DictReader(open('libor.csv'))
    data = []
    for d in libor_data:
        data.append(d)

    col_sample = defaultdict(dict)
    for dp in data:
        if dp['Bank/Fixed'] in banks:
        # col_sample[dp['Date']][dp['Bank/Fixed']] = {'Bank': dp['Bank/Fixed'], XM: dp[XM]}
            col_sample[dp['Date']][dp['Bank/Fixed']] = dp[XM]

    return col_sample


data_3M = process_libor_data()
# for k, v in data_3M.items()[:100]:
#     print k, v['FIX - USD'], v['Barclays']

row_data = []
for k,v in data_3M.items():
    v.update({'date': k})
    row_data.append(v)  


print row_data[:10]
    
row_data.sort(key = lambda x: datetime.datetime.strptime(x['date'], '%d/%m/%Y'))

print row_data[:100]

# import json
# json.dump(row_data, open('libor_data_3M.js', 'wb'))

writer = unicodecsv.DictWriter(open('libor_data_3M.csv', 'w'), ['date'] + banks)

writer.writeheader()

for row in row_data:
    writer.writerow(row)


