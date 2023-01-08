import { CeramicClient } from '@ceramicnetwork/http-client';
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking';
import { DIDDataStore } from '@glazed/did-datastore';
import { DIDSession } from '@glazed/did-session';

const profileForm = document.getElementById('profile-form');
const walletBtn = document.getElementById('connect-wallet');
const profileName = document.getElementById('name');
const profileGender = document.getElementById('gender');
const profileCountry = document.getElementById('country');
const submitBtn = document.getElementById('submit-btn');