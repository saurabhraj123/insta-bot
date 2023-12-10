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

export const getInstaPageIdsWithName = async (instagramBusinessAccountIds: string[], accessToken: string) => {
  try {
    const instaPageIdsWithName: { id: string; name: string; username: string }[] = []

    for (const instagramBusinessAccountId of instagramBusinessAccountIds) {
      const { data } = await axios.get(
        `${FACEBOOK_GRAPH_API_BASE_URL}/${instagramBusinessAccountId}?fields=name,username&access_token=${accessToken}`,
      )

      const { name, username } = data
      if (name && username) instaPageIdsWithName.push({ id: instagramBusinessAccountId, name, username })
    }

    return instaPageIdsWithName
  } catch (err) {
    throw err
  }
}

export const getInstaPageDetails = async (accessToken: string) => {
  const facebookPageIds = await getFacebookPageIds(accessToken)
  const instagramBusinessAccountIds = await getInstagramBusinessAccountIds(facebookPageIds, accessToken)
  return await getInstaPageIdsWithName(instagramBusinessAccountIds, accessToken)
}
