import extractDomain from "extract-domain"

export const getSiteName = (url: string) => {
  const givenUrl = new URL(url)
  const parsedUrl = extractDomain(url)

  if (parsedUrl != "github.com") {
    return parsedUrl
  } else {
    const paths = givenUrl.pathname.split("/").filter((ele) => ele != "")
    return `${parsedUrl}/${paths[0]}`
  }
}
