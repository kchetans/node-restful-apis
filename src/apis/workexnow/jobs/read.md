## Jobs

1. Post Job             :   EMPLOYER        :       jobs.postJob
2. Update Job           :   EMPLOYER        :       jobs.updateJob
3. Get Active Jobs      :   EMPLOYER        :       jobs.getActiveJobs
4. Get Non Active Jobs  :   EMPLOYER        :       jobs.getNonActiveJobs
5. 



## Job Application

1. Apply                : EMPLOYEE          :       job-application.apply
2. ShortList            : EMPLOYER          :       job-application.shortList
3. Send Interest        : EMPLOYER          :       job-application.sendInterest
4. Accept Interest      : EMPLOYEE          :       job-application.acceptInterest
5. Reject Interest      : EMPLOYEE          :       job-application.rejectInterest
6. Send Offer Letter    : EMPLOYER          :       job-application.sendOfferLetter
7. Accept Offer Letter  : EMPLOYEE          :       job-application.acceptOfferLetter
8. Reject Offer Letter  : EMPLOYEE          :       job-application.rejectOfferLeetter
8. Reject Candidate     : EMPLOYER          :       job-application.rejectCandidate

NOTE : Reject Candidate has 2 cases:
 1. Candidate applied and then Employer Reject, 
 2. Employer reject any other time, ex: after matched or after hire.
 
 
 
 
 
 
 
 Employer => short-list/:user_id  =>  1. No Application     => send-interest
                                      2. Applied            => Matched
                                      
 Employer => reject/:user_id      =>  1. Matched            => rejected
                                      2. Applied            => rejected
                                      2. offer_letter_sent  => rejected
                                      
 Employer => send-offer/:user_id  =>  * any_state           => offer_letter_sent                                        