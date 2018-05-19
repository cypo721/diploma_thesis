export function resolveContentLink(link, language) {
  let resultLink;
  switch (link.type) {
    case "mobile_phone":
      resultLink = `/mobiles/${link.id}`;
      break;
    case "notebook":
      resultLink = `/notebooks/${link.id}`;
      break;
    case "tablet":
      resultLink = `/tablet/${link.id}`;
      break;
    default:
      resultLink = "";
  }

  if(language){
    resultLink = `/${language.toLowerCase()}${resultLink}`
  }

  return resultLink;
}