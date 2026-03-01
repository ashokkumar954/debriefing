/**
 * @licence
 * Copyright (c) 2019, Oracle and/or its affiliates. All rights reserved.
 * Oracle Technology Network Developer License Terms (http://www.oracle.com/technetwork/licenses/production-modify-license-2162709.html)
 */

define([], () => {
         "use strict";
     
         class ApplicationCriticalError {
             constructor(heading, message) {
                 this.heading = heading;
                 this.message = message;
             }
         }
     
         return ApplicationCriticalError;
     });