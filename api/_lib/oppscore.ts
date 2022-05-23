import { corsProxy, imgCorsParams } from "./corsProxy";

interface OppscoreHtmlProps {
  name: string;
  title: string;
  party: string;
  score: string;
  image: string;
}

export function oppscore_html(props: OppscoreHtmlProps) {
  const { name, title, party, score: scoreStr, image } = props;

  // const public_host = process.env.NEXT_PUBLIC_HOST || "";
  const assets_host = "https://www.oppscore.org";

  const gousaRed = "#c02529";
  const gousaBlue = "#275aa9";

  const rootStyle = `
          width: 1080px;
          height: 1080px;
          font-family: Helvetica, Arial, Sans-Serif;
          font-weight: bold;
          font-size: 1.5em;
          text-align: center;
          padding: 30px;
          background-color: white;
    `;

  // src is 800x240, want 80 h, so 266x80
  const gousa_logo = `
      <img src="${assets_host}/static/brand/GOUSA_Logo-800x240.png" width="266px" height="80px" style="display: block; margin: auto;" />
    `;

  // src -s 1173x294 want w 600px so 600x150
  const oppscore_logo = `
      <img src="${assets_host}/static/brand/oppscore-logo.png" width="600px" height="150px" style="display: block; margin: auto" />
    `;

  //
  const partyStr = party ? `${party} Party` : "";

  const score = Number.parseFloat(scoreStr);
  const scoreNumberString = (score > 0 ? "+" : "") + score.toFixed(2);
  const scoreColor = score <= 0 ? gousaRed : gousaBlue;

  const score_arrow_image =
    score <= 0 ? "/static/RedDownArrow128.png" : "/static/BlueUpArrow128.png";

  //
  const subject_info = `
      <h2 style="margin: 0;">Politician:</h2>
      <h1 style="margin: 0; ">${name.toUpperCase()}</h1>
      <p style="margin-top: 0;">${title}<br/>
      ${partyStr}</p>
    `;

  const headshot_image = corsProxy(image);

  const subject_photo = `
    <div style="max-width: 275px; height: 275px; display: inline-block">
      <img
      ${imgCorsParams}
      src="${headshot_image}"
      height="275px" />
    </div>
    `;

  // score_with_arrow 200w x 240h : score: 200x120 arrow (src 128x128): 115x115
  const score_with_arrow = `
      <div style="width: 200px; height: 240px; display: inline-block; vertical-align: text-bottom; margin-left: 60px">
        <div style="width: 200px; height: 120px; border: 2px solid black; text-align: center; font-size: 30px;">
          <p style="margin-top: 10px">SCORE:<br />
          <span style="color: ${scoreColor}; font-weight: 800; ">${scoreNumberString}</span> / 5</p>
        </div>
        <img src="${assets_host}${score_arrow_image}" width="115px"  style="display: block; margin: auto" />
      </div>
    `;

  const stars_image = scoreStarsImage(score);
  //
  const opportunity_score = `
      <div>
        <p>Opportunity Score&trade; (scale -5.0 to +5.0):
        <span style="color: ${scoreColor}; font-weight: 800; font-size: 1.5em;">${scoreNumberString}</span></p>
  
        <img src="${assets_host}${stars_image}" height="112px"  style="display: block; margin: auto" />
        <p>RATING:  <span style="color: ${scoreColor}; font-weight: 800; font-size: 1.5em;">${scoreTextLookup(
    score
  ).toUpperCase()}</span></p>
      </div>
    `;

  const html = `
        <div style="${rootStyle}">
          ${gousa_logo}
          ${oppscore_logo}
          ${subject_info}
          <div>
            ${subject_photo}
            ${score_with_arrow}
          </div>
          ${opportunity_score}
        </div>`;

  return html;
}

function scoreStarsImage(score: number, fullstars: boolean = false): string {
  const quarterScore = Math.round(score * 4) / 4;
  const prefix =
    score >= 0 || approxeq(score, 0) ? quarterScore : `minus-${-quarterScore}`;
  const name = `/static/star-graphics/${prefix}-stars.png`;
  if (fullstars) {
    return name.replace("stars.png", "stars-10.png");
  } else {
    return name;
  }
}

export function scoreTextLookup(score: number) {
  if (approxeq(score, 0, 0.001)) return "Zero Opportunity Score";
  else if (score <= -3.0 && score >= -5.0)
    return "Extreme Anti-Opportunity Score";
  else if (score < 0) return "Poor Anti-Opportunity Score";
  else if (score < 2.0) return "Weak Opportunity Score";
  else if (score < 4.0) return "Moderate Pro-Opportunity Score";
  else if (score <= 5.0) return "Strong Pro-Opportunity Score";
  return `[Score error ${score}]`;
}

function approxeq(v1: number, v2: number, epsilon = 0.001) {
  return Math.abs(v1 - v2) <= epsilon;
}
