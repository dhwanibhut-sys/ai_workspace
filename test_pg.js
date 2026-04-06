const { Client } = require('pg');

const regions = [
  'ap-south-1',
  'us-east-1',
  'eu-central-1',
  'ap-southeast-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ap-east-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-southeast-2',
  'ca-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'sa-east-1'
];

async function testRegions() {
  console.log("Starting region bruteforce...");
  for (const r of regions) {
    const url = `postgresql://postgres.ukqybafmgsfrvhwivrlo:Dhwani!3811@aws-0-${r}.pooler.supabase.com:5432/postgres`;
    const client = new Client({ connectionString: url, connectionTimeoutMillis: 3000 });
    try {
      await client.connect();
      console.log(`\n========= FOUND IT =========\nRegion: ${r}\nURL: ${url}\n============================\n`);
      await client.end();
      return url;
    } catch (e) {
      if (e.message.includes('password authentication failed')) {
        console.log(`\n========= FOUND IT =========\nRegion: ${r}\nURL: ${url}\n(Password failed, but region is correct!)\n============================\n`);
        return url;
      }
      console.log(`[${r}] Failed:`, e.message.substring(0, 50));
    }
  }
}

testRegions().then(() => process.exit(0)).catch(e => console.error(e));
