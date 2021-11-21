const elastic = require('elasticsearch')

const client = new elastic.Client({
    host: 'localhost:9200'
})

const theMessage = {
    text: "Testing"
}

async function search() {
    client.search({
        index: "my-first-index",
        type: "message",
        body: {
             query: {
                  query_string: {
                       query: "hello"
                      }
                   }
                 }
}).then(function(response) {
    console.log("Hello Result " + JSON.stringify(response));
    response.hits.hits.forEach(function(hit) {
        console.log(hit._source.text);
        })
    });
}

const main = async () => {
    await client.index({
        index: "my-first-index",
        type: "message",
        body: theMessage
    })
    /** searching wont immadiately available after indexing */
    setTimeout(search, 1100);
    
    /** kibana's data example kibana_sample_data_ecommerce, install kibana and add those data example */
    const allResult = await client.search({
        index: "kibana_sample_data_ecommerce",
        body: {
            query: {
                "match_all": {}
            },
            _source: false,
            fields: [ "customer_gender", "email" ]
        }
    })
    console.log(allResult.hits.hits);

}

main();
