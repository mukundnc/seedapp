#!/bin/bash
echo "#!/bin/bash" > ./loadit.sh
echo "" >> ./loadit.sh
echo "curl -XDELETE http://localhost:9200/newindex?pretty" >> ./loadit.sh
echo "" >> ./loadit.sh
echo "curl -XPUT http://localhost:9200/newindex?pretty" >> ./loadit.sh
echo "" >> ./loadit.sh
COUNTER=0
FILES="/Users/vishal/work/CV_OUT/r*.txt"
for f in $FILES
do
  COUNTER=$[COUNTER + 1]
  CONTENT="`cat $f | sed "s/'//g"`"
  echo "curl -XPUT http://localhost:9200/newindex/doc/$COUNTER -d \
       '{\"name\" : \"$f\", \"content\" : \"$CONTENT\"}'" >> ./loadit.sh
  echo "" >> ./loadit.sh
done
chmod 777 ./loadit.sh
/bin/bash ./loadit.sh