'use strict';
const express = require('express');
const app = new express();
const port = 3007;

app.use(express.json());

/* --------------------- */

var userRouter = require('./routes/UserRoutes');
var skuRouter = require('./routes/SkuRoutes');
var internalOrderRouter = require('./routes/InternalOrderRoutes');
var restockOrderRouter = require('./routes/RestockOrderRoutes');
var returnOrderRouter = require('./routes/ReturnOrderRoutes');
var skuItemRouter = require('./routes/SkuItemRoutes');
var positionRouter = require('./routes/PositionRoutes');
var itemRouter = require('./routes/ItemRoutes');
var testResultRouter = require('./routes/TestResultRoutes');
var testDescriptorRouter = require('./routes/TestDescriptorRoutes');


app.use('/api', userRouter);
app.use('/api/', skuRouter);
app.use('/api/', internalOrderRouter);
app.use('/api/', restockOrderRouter);
app.use('/api/', returnOrderRouter);
app.use('/api/', skuItemRouter);
app.use('/api/', positionRouter);
app.use('/api/', itemRouter);
app.use('/api/', testResultRouter); 
app.use('/api/', testDescriptorRouter);

/* --------------------- */

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;