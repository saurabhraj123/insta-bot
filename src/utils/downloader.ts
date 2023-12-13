/** External */
import _ from 'lodash'
import axios from 'axios'

/** variables */
const instaPostGraphqlData: { [key: string]: string } = {}

/** types */
interface GraphqlData {
  graphql: {
    shortcode_media: {
      __typename: string
      edge_sidecar_to_children: {
        edges: {
          node: {
            __typename: string
            video_url: string
            display_url: string
          }
        }[]
      }
      video_url: string
      display_url: string
    }
  }
}

type MediaType = 'GraphVideo' | 'GraphImage' | 'GraphSidecar'

/** Private functions */
const getPostIdFromUrl = (instagramPostUrl: string) => {
  if (!instagramPostUrl) return null

  const match = instagramPostUrl.match(/\/(p|reel)\/([^/]+)/)
  return match ? match[2] : null
}

const getGraphqlDataFromPostId = async (postId: string): Promise<GraphqlData | null> => {
  try {
    const { data } = await axios.get(`https://www.instagram.com/p/${postId}?__a=1&__d=dis`)
    return data
  } catch (err) {
    return null
  }
}

const getMediaType = (graphqlData: GraphqlData) => {
  return graphqlData.graphql.shortcode_media.__typename as MediaType
}

const getCaption = (graphqlData: GraphqlData) => {
  return _.get(graphqlData, 'graphql.shortcode_media.edge_media_to_caption.edges[0].node.text')
}

const getImageDownloadUrl = (graphqlData: GraphqlData) => {
  return _.get(graphqlData, 'graphql.shortcode_media.display_url')
}

const getVideoDownloadUrl = (graphqlData: GraphqlData) => {
  return _.get(graphqlData, 'graphql.shortcode_media.video_url')
}

const getHtmlFormattedMenuString = (caption: string, mediaType: MediaType) => {
  return `
<b>Caption:</b> 
${caption}

<b>Media type:</b> 
${mediaType}

<b>What do you want to do?</b>
1. Go to the next step
2. Update caption

Enter /cancel to go to main menu.
  `
}

/** Public functions */
export const getMediaDetailsMenu = async (userId: string, instagramPostUrl: string, updatedCaption?: string) => {
  const postId = getPostIdFromUrl(instagramPostUrl)
  if (!postId) return null

  let graphqlData = null
  if (instaPostGraphqlData[postId]) {
    graphqlData = JSON.parse(instaPostGraphqlData[postId])
  } else {
    graphqlData = await getGraphqlDataFromPostId(postId)
    if (!graphqlData) return null
    instaPostGraphqlData[postId] = JSON.stringify(graphqlData)
  }

  let caption = updatedCaption
  if (!updatedCaption) caption = getCaption(graphqlData)
  if (!caption) return null

  const mediaType = getMediaType(graphqlData)
  if (!mediaType) return null

  return getHtmlFormattedMenuString(caption, mediaType)
}
