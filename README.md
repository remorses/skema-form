# nodejs-lib-template
```typescript
import React, { useState } from 'react'
import { Box, Button, Card, Row } from 'hybrid-components'
const schema = require('schema.json')

const App = () => {

    const [values, setValues] = useState(null)

    return (
        <Row justifyContent='center'>
            <Card maxWidth='500px'>
                <SchemaForm
                    onSubmit={onSubmit}
                    schema={schema}
                    components={atlasComponents}
                    onChange={({ value, }) => setValues(value)}
                />
                <Box my={3} />
                <Card bg='gray'>
                    <pre>{JSON.stringify(values, null, 2)}</pre>
                </Card>
            </Card>
        </Row>
    )
}

```
