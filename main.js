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

// Setting placeholders as there is nothing there on page load

walletBtn.innerHTML = "Connect Wallet"
profileName.innerHTML = "Name: "
profileGender.innerHTML = "Gender: "
profileCountry.innerHTML = "Country: "


// Instantiating a new instance of Ceramic

const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");

// Defining aliases to be used to declare both the schemas and the definition for the tile we want to create

aliases = {
    schemas: {
        basicProfile: 'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio',
    },
    definitions: {
        BasicProfile: 'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic',
    },
    tiles: {},
};

const datastore = new DIDDataStore({ ceramic, model: aliases })

// The authenticate with Ethereum function to connect to injected wallet provider (Metamask in this case) -> Account for the fact that the user may not have an injected wallet provider

async function authenticateWithEthereum(ethereumProvider)
{
    const accounts = await ethereumProvider.request({
        method: 'eth_requestAccounts',
    });

    const authProvider = new EthereumAuthProvider(ethereumProvider, accounts[0]);

    const session = new DIDSession({ authProvide });

    const did = await session.authorize();

    ceramic.did = did;
}

// Check to ensure that the user has an injected wallet provider

async function auth()
{
    if (window.ethereum == null) 
    {
        throw new Error('No injected wallet provider found!');
    }

    await authenticateWithEthereum(window.ethereum);

}

// Reading data using Ceramic

async function getProfileFromCeramic()
{
    try 
    { 
        const profile = await datastore.get('BasicProfile');

        // Render this data to the DOM using the local variable referenced above

        renderProfileData(profile);
    } catch (error)
    {
        console.error(error);
    }
}

// Creating a function to render the data to the DOM 

function renderProfileData(data)
{
    if (!data) return;

    data.name ? profileName.innerHTML = "Name:     " + data.name : profileName.innerHTML = "Name:     "
    data.gender ? profileGender.innerHTML = "Gender:     " + data.gender : profileGender.innerHTML = "Gender:     "
    data.country ? profileCountry.innerHTML = "Country:     " + data.country : profileCountry.innerHTML = "Country:     "
}

// Writing function to update the data located on Ceramic

async function updateProfileOnCeramic()
{
    try 
    {
        const updatedProfile = getFormProfileData();
        submitBtn.value = "Updating...";

        await datastore.merge('BasicProfile', updatedProfile);

        const profile = await datastore.get('BasicProfile');

        renderProfileData(profile);

        submitBtn.value = "Submit";

    } catch (error)
    {
        console.error(erorr);
    }
}

// Writing a function to get the value of the form submitted

function getFormProfileData()
{
    const name = document.getElementById('name').value;
    const country = document.getElementById('country').value;
    const gender = document.getElementById('gender').value;

    return (
        name,
        country,
        gender
    );
}

// calling the authentcation check function and the callback

async function connectWallet(authFunction, callback) {
    try {
    walletBtn.innerHTML = "Connecting..."
    await authFunction()
    await callback()
    walletBtn.innerHTML = "Wallet Connected"

    } catch (error) {
    console.error(error)
    }

}

// Adding event listeners for the DOM 

walletBtn.addEventListener('click', async () => await connectWallet(auth, getProfileFromCeramic))

profileForm.addEventListener('submit', async (e) => {
e.preventDefault()
await updateProfileOnCeramic()

})