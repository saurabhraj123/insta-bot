/** External */
import _ from 'lodash'
import axios from 'axios'

/** Internal */
import { FACEBOOK_GRAPH_API_BASE_URL } from '../config/common.js'

export const getFacebookPageIds = async (accessToken: string) => {
  try {
    const { data } = await axios.get(`${FACEBOOK_GRAPH_API_BASE_URL}/me/accounts?access_token=${accessToken}`)

    const facebookPages = data.data
    return _.map(facebookPages, 'id')
  } catch (err) {
    throw err
  }
}

export const getInstagramBusinessAccountIds = async (facebookPageIds: string[], accessToken: string) => {
  try {
    const instagramBusinessAccountIds: string[] = []

    for (const facebookPageId of facebookPageIds) {
      const { data } = await axios.get(
        `${FACEBOOK_GRAPH_API_BASE_URL}/${facebookPageId}?fields=instagram_business_account&access_token=${accessToken}`,
      )

      const instagramBusinessAccountId = data?.instagram_business_account?.id
      if (instagramBusinessAccountId) instagramBusinessAccountIds.push(instagramBusinessAccountId)
    }

    return instagramBusinessAccountIds
  } catch (err) {
    throw err
  }
}

export const getInstaPageIdWithName = async (instagramBusinessAccountIds: string[], accessToken: string) => {
  try {
    const instaPageIdWithName: { [key: string]: string } = {}

    for (const instagramBusinessAccountId of instagramBusinessAccountIds) {
      const { data } = await axios.get(
        `${FACEBOOK_GRAPH_API_BASE_URL}/${instagramBusinessAccountId}?fields=name&access_token=${accessToken}`,
      )

      const instagramBusinessAccountName = data?.name
      if (instagramBusinessAccountName) instaPageIdWithName[instagramBusinessAccountId] = instagramBusinessAccountName
    }

    return instaPageIdWithName
  } catch (err) {
    throw err
  }
}

export const getInstaPageDetailsAndAddToDb = async (accessToken: string) => {
  const facebookPageIds = await getFacebookPageIds(accessToken)
  const instagramBusinessAccountIds = await getInstagramBusinessAccountIds(facebookPageIds, accessToken)
  const instaPageIdWithName = await getInstaPageIdWithName(instagramBusinessAccountIds, accessToken)
}
