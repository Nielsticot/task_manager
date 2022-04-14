import getDriver from "../../utils/neo4j"

const driver = getDriver()
const session = driver.session()

export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const TxResultPromise = session.readTransaction(
          async (transaction) => {
            const cypher = `
              MATCH (n)
              RETURN n;
            `

            const TxResponse = await transaction.run(cypher)
            const result = TxResponse.records.map((r) => r.get('n'))
            return result
          }
        )
        const result = await TxResultPromise
        res.status(200).json({ success: true, result })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}