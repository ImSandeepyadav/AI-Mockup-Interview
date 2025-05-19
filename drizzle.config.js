/** @type {import ("drizzle-kit").Config} */
export default ({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_9Dl3gvMiQRWI@ep-falling-rain-a5fdjnf4.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require'
  }
});