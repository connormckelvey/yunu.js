

// if (require.main === module) {
//   const envValues = {
//     name: process.env.JOB_NAME || defaultValues.name,
//     db: { 
//       name: process.env.JOB_DB_NAME || defaultValues.db.name 
//     }
//   }

//   const argValues = { ...argv.values }

//   const values = deepmerge.all([defaultValues, envValues, argValues])
  
//   console.log(K8sJobManifest(values as K8sJobManifestValues))
// }