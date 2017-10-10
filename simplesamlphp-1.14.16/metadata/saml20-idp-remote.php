<?php
/**
 * SAML 2.0 remote IdP metadata for SimpleSAMLphp.
 *
 * Remember to remove the IdPs you don't use from this file.
 *
 * See: https://simplesamlphp.org/docs/stable/simplesamlphp-reference-idp-remote 
 */

/*
 * Guest IdP. allows users to sign up and register. Great for testing!
 */
$metadata['https://openidp.feide.no'] = array(
	'name' => array(
		'en' => 'Feide OpenIdP - guest users',
		'no' => 'Feide Gjestebrukere',
	),
	'description'          => 'Here you can login with your account on Feide RnD OpenID. If you do not already have an account on this identity provider, you can create a new one by following the create new account link and follow the instructions.',

	'SingleSignOnService'  => 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
	'SingleLogoutService'  => 'https://openidp.feide.no/simplesaml/saml2/idp/SingleLogoutService.php',
	'certFingerprint'      => 'c9ed4dfb07caf13fc21e0fec1572047eb8a7a4cb'
);



$metadata['urn:mace:incommon:washington.edu'] = array (
  'entityid' => 'urn:mace:incommon:washington.edu',
  'description' => 
  array (
    'en' => 'University of Washington',
  ),
  'OrganizationName' => 
  array (
    'en' => 'University of Washington',
  ),
  'name' => 
  array (
    'en' => 'University of Washington',
  ),
  'OrganizationDisplayName' => 
  array (
    'en' => 'University of Washington',
  ),
  'url' => 
  array (
    'en' => 'http://www.washington.edu/',
  ),
  'OrganizationURL' => 
  array (
    'en' => 'http://www.washington.edu/',
  ),
  'contacts' => 
  array (
    0 => 
    array (
      'contactType' => 'technical',
      'givenName' => 'IAM Technical Support',
      'emailAddress' => 
      array (
        0 => 'iam-support@uw.edu',
      ),
    ),
    1 => 
    array (
      'contactType' => 'administrative',
      'givenName' => 'IAM Administrative Support',
      'emailAddress' => 
      array (
        0 => 'iam-support@uw.edu',
      ),
    ),
  ),
  'metadata-set' => 'saml20-idp-remote',
  'SingleSignOnService' => 
  array (
    0 => 
    array (
      'Binding' => 'urn:mace:shibboleth:1.0:profiles:AuthnRequest',
      'Location' => 'https://idp.u.washington.edu/idp/profile/Shibboleth/SSO',
    ),
    1 => 
    array (
      'Binding' => 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
      'Location' => 'https://idp.u.washington.edu/idp/profile/SAML2/POST/SSO',
    ),
    2 => 
    array (
      'Binding' => 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
      'Location' => 'https://idp.u.washington.edu/idp/profile/SAML2/Redirect/SSO',
    ),
    3 => 
    array (
      'Binding' => 'urn:oasis:names:tc:SAML:2.0:bindings:SOAP',
      'Location' => 'https://idp.u.washington.edu/idp/profile/SAML2/SOAP/ECP',
    ),
  ),
  'SingleLogoutService' => 
  array (
  ),
  'ArtifactResolutionService' => 
  array (
  ),
  'NameIDFormats' => 
  array (
  ),
  'keys' => 
  array (
    0 => 
    array (
      'encryption' => false,
      'signing' => true,
      'type' => 'X509Certificate',
      'X509Certificate' => '
MIID/TCCAuWgAwIBAgIJAMoYJbDt9lKKMA0GCSqGSIb3DQEBBQUAMFwxCzAJBgNV
BAYTAlVTMQswCQYDVQQIEwJXQTEhMB8GA1UEChMYVW5pdmVyc2l0eSBvZiBXYXNo
aW5ndG9uMR0wGwYDVQQDExRpZHAudS53YXNoaW5ndG9uLmVkdTAeFw0xMTA0MjYx
OTEwMzlaFw0yMTA0MjMxOTEwMzlaMFwxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJX
QTEhMB8GA1UEChMYVW5pdmVyc2l0eSBvZiBXYXNoaW5ndG9uMR0wGwYDVQQDExRp
ZHAudS53YXNoaW5ndG9uLmVkdTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAMH9G8m68L0Hf9bmf4/7c+ERxgDQrbq50NfSi2YTQWc1veUIPYbZy1agSNuc
4dwn3RtC0uOQbdNTYUAiVTcYgaYceJVB7syWf9QyGIrglZPMu98c5hWb7vqwvs6d
3s2Sm7tBib2v6xQDDiZ4KJxpdAvsoPQlmGdgpFfmAsiYrnYFXLTHgbgCc/YhV8lu
bTakUdI3bMYWfh9dkj+DVGUmt2gLtQUzbuH8EU44vnXgrQYSXNQkmRcyoE3rj4Rh
hbu/p5D3P+nuOukLYFOLRaNeiiGyTu3P7gtc/dy/UjUrf+pH75UUU7Lb369dGEfZ
wvVtITXsdyp0pBfun4CP808H9N0CAwEAAaOBwTCBvjAdBgNVHQ4EFgQUP5smx3ZY
KODMkDglkTbduvLcGYAwgY4GA1UdIwSBhjCBg4AUP5smx3ZYKODMkDglkTbduvLc
GYChYKReMFwxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJXQTEhMB8GA1UEChMYVW5p
dmVyc2l0eSBvZiBXYXNoaW5ndG9uMR0wGwYDVQQDExRpZHAudS53YXNoaW5ndG9u
LmVkdYIJAMoYJbDt9lKKMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEFBQADggEB
AEo7c2CNHEI+Fvz5DhwumU+WHXqwSOK47MxXwNJVpFQ9GPR2ZGDAq6hzLJLAVWcY
4kB3ECDkRtysAWSFHm1roOU7xsU9f0C17QokoXfLNC0d7KoivPM6ctl8aRftU5mo
yFJkkJX3qSExXrl053uxTOQVPms4ypkYv1A/FBZWgSC8eNoYnBnv1Mhy4m8bfeEN
7qT9rFoxh4cVjMH1Ykq7JWyFXLEB4ifzH4KHyplt5Ryv61eh6J1YPFa2RurVTyGp
HJZeOLUIBvJu15GzcexuDDXe0kg7sHD6PbK0xzEF/QeXP/hXzMxR9kQXB/IR/b2k
4ien+EM3eY/ueBcTZ95dgVM=
          ',
    ),
  ),
  'scope' => 
  array (
    0 => 'washington.edu',
  ),
  'EntityAttributes' => 
  array (
    'http://macedir.org/entity-category-support' => 
    array (
      0 => 'http://id.incommon.org/category/research-and-scholarship',
    ),
  ),
  'UIInfo' => 
  array (
    'DisplayName' => 
    array (
      'en' => 'University of Washington',
    ),
    'Description' => 
    array (
      'en' => 'The University of Washington IdP enables standards-based federation for the UW community.',
    ),
    'InformationURL' => 
    array (
      'en' => 'https://wiki.cac.washington.edu/x/fiOD',
    ),
    'PrivacyStatementURL' => 
    array (
    ),
    'Logo' => 
    array (
      0 => 
      array (
        'url' => 'https://wiki.cac.washington.edu/download/attachments/8594302/uw.png',
        'height' => 63,
        'width' => 128,
        'lang' => 'en',
      ),
    ),
  ),
);

