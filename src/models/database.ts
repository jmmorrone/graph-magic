import Neode from 'neode'

const neo4jURI = process.env.NEO4J_URL || 'neo4j://localhost'

export const instance = new Neode(neo4jURI, 'neo4j', 'neo4j')

