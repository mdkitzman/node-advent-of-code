import axios from "axios"
import parse from 'node-html-parser';
import { NodeHtmlMarkdown } from 'node-html-markdown';;

const pkg = require("../package.json");

function throwErr(msg: string){
  throw new Error(msg);
}

var TOKEN = process.env.AOC_SESSION_TOKEN || 
             throwErr("please set the AOC_SESSION_TOKEN environmental variable");

const client = axios.create({
  baseURL: "https://adventofcode.com",
  headers: {
    "User-Agent": `node/${process.version} ${pkg.name}/${pkg.version} (${pkg.repository.url})`,
    Cookie: `session=${TOKEN}`,
  },
});

export const getReadme = async (day: number, year: number): Promise<string> => {
  const { data } = await client.get(`${year}/day/${day}`);
  const root = parse(data);
  const [main] = root.getElementsByTagName("main");
  const mdData = NodeHtmlMarkdown.translate(main.toString());
  return mdData;
}

export const getPuzzleInput = async (day: number, year: number): Promise<string> => {
  const { data } = await client.get(`${year}/day/${day}/input`);
  return data.trim();
}