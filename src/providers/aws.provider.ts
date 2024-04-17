import AWS from 'aws-sdk'
import { Constant } from '@constants'
import { keccak256 } from 'ethers/lib/utils'
import mime from 'mime-types'

const s3 = new AWS.S3({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: `${process.env.S3_ACCESS_KEY}`,
    secretAccessKey: `${process.env.S3_SECRET_ACCESS_KEY}`
  }
})

const uploadFileS3 = async (imageBuffer: Buffer): Promise<string> => {
  const fileName = keccak256(imageBuffer)

  const uploadParams = {
    Bucket: Constant.S3_BUCKET_NAME,
    Key: fileName,
    Body: imageBuffer,
    ACL: 'public-read',
    ContentType: mime.lookup(fileName) || undefined
  }

  await s3.upload(uploadParams).promise()

  return fileName
}

const readFileS3 = async (key: string) => {
  const params = {
    Bucket: Constant.S3_BUCKET_NAME,
    Key: key
  }

  try {
    const data = await s3.getObject(params).promise()
    return data.Body
  } catch (error) {
    throw new Error(Constant.NETWORK_STATUS_MESSAGE.NOT_FOUND)
  }
}

export { uploadFileS3, readFileS3 }
