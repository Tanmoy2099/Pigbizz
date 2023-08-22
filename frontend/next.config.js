/** @type {import('next').NextConfig} */
// require('dotenv').config({ path: '.env' })
// import dotenv from 'dotenv'
// dotenv.config({ path: '.env' })

const nextConfig = {
  reactStrictMode: true,
  env: {
    appname: "PigBizz",
    backend_baseURl: "http://localhost:5000", // live server url
    // backend_baseURl: "http://192.168.1.2:5000", // live server url
  },
};

module.exports = nextConfig;
